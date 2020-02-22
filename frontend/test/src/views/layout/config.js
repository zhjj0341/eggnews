import { generateTitle } from '@/utils/global'
const moduleTitle = title => generateTitle(title, 'module') // 获取多语言module里面的值
export const PLATFORM_INFO_LIST = [
  {
    content: moduleTitle('onLineUsers'),
    path: '/page/onLineUsers',
    icon: 'icon-renshu',
    valueName: 'on_line_amount'
  },
  {
    content: moduleTitle('DepositAudit'),
    path: '/page/payment/deposit',
    icon: 'icon-deposit1',
    valueName: 'charge'
  },
  {
    content: moduleTitle('WithdrawalAudit'),
    path: '/page/payment/withdraw',
    icon: 'icon-withdrawals',
    valueName: 'withdraw'
  },
  {
    content: moduleTitle('paymentManagement'),
    path: '/page/payment/management',
    icon: 'icon-wage',
    valueName: 'withdrawFinance'
  },
  {
    content: moduleTitle('CommissionReport'),
    path: '/page/report/commission',
    icon: 'icon-yongjin',
    valueName: 'commission'
  },
  {
    content: moduleTitle('DailyWageReport'),
    path: '/page/report/salary',
    icon: 'icon-yuangonggongzi',
    valueName: 'dailyWage'
  },
  {
    content: moduleTitle('DividendReport'),
    path: '/page/agent/bonusreport',
    icon: 'icon-hongbao-m',
    valueName: 'dividend'
  },
  {
    content: moduleTitle('ActivityAuditList'),
    path: '/page/activity/auditlist',
    icon: 'icon-huodong',
    valueName: 'rewardProgram'
  }
]
