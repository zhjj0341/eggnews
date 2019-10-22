const Service = require('egg').Service;

class NewsService extends Service {
    async list (page = 1) {
        // read config
        const { serverUrl, pageSize } = this.config.news;

        // use build-in http client to GET hacker-news api
        const { data: idList } = await this.ctx.curl(`${serverUrl}/topstories.json`, {
            data: {
                orderBy: '"$key"',
                startAt: `"${pageSize * (page - 1)}"`,
                endAt: `"${pageSize * page - 1}"`,
            },
            dataType: 'json',
        });

        // parallel GET detail
        const newsList = await Promise.all(
            Object.keys(idList).map(key => {
                const url = `${serverUrl}/item/${idList[key]}.json`;
                return this.ctx.curl(url, { dataType: 'json' });
            })
        );
        return newsList.map(res => res.data);
    }

    /**
   * request hacker-news api
   * @param api - Api name
   * @param opts - urllib options
   */
    async request (api, opts) {
        const options = Object.assign({
            dataType: 'json',
            timeout: ['30s', '30s'],
        }, opts);

        const result = await this.ctx.curl(`${this.config.news.serverUrl}/${api}`, options);
        return result.data;
    }

    /**
     * get top story ids
     * @param page - page number, 1-ase
     * @param pageSize - page count
     */
    async getTopStories (page, pageSize) {
        page = page || 1;
        pageSize = pageSize || this.config.news.pageSize;

        try {
            const result = await this.request('topstories.json', {
                data: {
                    orderBy: '"$key"',
                    startAt: `"${pageSize * (page - 1)}"`,
                    endAt: `"${pageSize * page - 1}"`,
                },
            });
            return Object.keys(result).map((key) => result[key]);
        } catch (e) {
            this.ctx.logger.error(e);
            return [];
        }
    }

    /**
     * query item
     * @param id - itemId
     */
    async getItem (id) {
        return await this.request(`item/${id}.json`);
    }

    /**
     * get user info
     * @param id - userId
     */
    async getUser (id) {
        return await this.request(`user/${id}.json`);
    }
}

module.exports = NewsService;