import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS


# configuration
DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

QUESTION = {
            "difficulty": 2,
            "type": 1,
            "content_type": 1,
            "candidate_type": 1,
            "_id": "5e5295998e5dba9fe60c090a",
            "level": 2,
            "desc": "完成短句。",
            "question": [
                {
                    "num": 1582462673939,
                    "type": 1,
                    "content": "门（___）大。 "
                },
                {
                    "num": 1582462785556,
                    "type": 1,
                    "content": "他有三个儿（___）"
                }
            ],
            "candidate": {
                "1582462673939": [
                    {
                        "num": 1582462675759,
                        "type": 1,
                        "content": "太"
                    },
                    {
                        "num": 1582462757366,
                        "type": 1,
                        "content": "大"
                    }
                ],
                "1582462785556": [
                    {
                        "num": 1582462821564,
                        "type": 1,
                        "content": "子"
                    },
                    {
                        "num": 1582462829731,
                        "type": 1,
                        "content": "了"
                    }
                ]
            },
            "candidate_group": [],
            "answer": {
                "1582462673939": 1582462675759,
                "1582462785556": 1582462821564
            },
            "__v": 0,
            "discrimination": "",
            "knowledge_point": "认读生字"
        }

# sanity check route
@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify('pong!')

@app.route('/test', methods=['GET', 'POST'])
def pre_test():
    response_object = {'status': 'success'}
    if request.method == 'POST':
        post_data = request.get_json()
        response_object['user_answer'] = post_data
    else:
        response_object['question'] = QUESTION

    return jsonify(response_object)

@app.route('/test/<question_id>', methods=['GET', 'POST'])
def next_question():
    response_object = {'status': 'success'}
    if request.method == 'POST':
        post_data = request.get_json()
        response_object['user_answer'] = post_data
    else:
        response_object['question'] = QUESTION

    return jsonify(response_object)

# @app.route('/books', methods=['GET', 'POST'])
# def all_books():
#     response_object = {'status': 'success'}
#     if request.method == 'POST':
#         post_data = request.get_json()
#         BOOKS.append({
#             'id': uuid.uuid4().hex,
#             'title': post_data.get('title'),
#             'author': post_data.get('author'),
#             'read': post_data.get('read')
#         })
#         response_object['message'] = 'Book added!'
#     else:
#         response_object['books'] = BOOKS
#     return jsonify(response_object)


# @app.route('/books/<book_id>', methods=['PUT', 'DELETE'])
# def single_book(book_id):
#     response_object = {'status': 'success'}
#     if request.method == 'PUT':
#         post_data = request.get_json()
#         remove_book(book_id)
#         BOOKS.append({
#             'id': uuid.uuid4().hex,
#             'title': post_data.get('title'),
#             'author': post_data.get('author'),
#             'read': post_data.get('read')
#         })
#         response_object['message'] = 'Book updated!'
#     if request.method == 'DELETE':
#         remove_book(book_id)
#         response_object['message'] = 'Book removed!'
#     return jsonify(response_object)


if __name__ == '__main__':
    app.run()
