/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-07-10 11:02:40
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2025-07-11 13:28:44
 * @FilePath: \gfdx\src\views\combatSimulation\ThinkAboutDetails\components\hooks\sceneData.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  title: '无人智能XX概念创新运用支持系统',
  label: '无人饱和攻击战想定详情',
  background: {
    title: '想定背景',
    time: '2025-06-17 17:35:46',
    content: [
      {
        text: '202X年，台湾当局公然进行“台独宣誓” “台独修宪” “独立公投”等分裂活动，我党中央和中央军委经慎重决策， 决定发起对台“战略决胜”作战。以最小化伤亡谋求最大化战果，利用无人智能化武器，发挥非对称优势，实施“对台无人饱和攻击战”。'
      }
      // {
      //   text: '202X年，台湾当局公然进行“台独宣誓” “台独修宪” “独立公投”等分裂活动，我党中央和中央仅为经慎重决策， 决定发起对台“战略决胜”作战，以最小化伤亡谋求最大化 战果，利用无人智能化武器，发挥非对称优势，实施“对台 无人饱和攻击战”。'
      // }
    ],
    imgUrl: require('@/assets/images/dt.png')
  },
  info: {
    title: '任务简报',
    time: '2025-06-17 17:35:46',
    content: [
      {
        text: '采用“一案多推”方式，对本方案进行50-200次推演，将仿真推演过程中的数据及结果数据进行采集处理，并分析统计，形成作战方案的评估结论。'
      }
    ]
  },
  objective: {
    title: '任务目的',
    time: '2025-06-17 17:35:46',
    content: [
      {
        text: '快速夺取台军台北桃园机场、台北附近岸滩、花莲机场、花莲港口等关键区域控制权，最小化人员伤亡，突出“陆/海/空/天协同+无人装备集群作战”优势'
      }
    ]
  },
  keywords: {
    title: '关键词',
    keys: [
      { label: '一案多推' },
      { label: '饱和攻击' },
      { label: '有人无人协同' }
    ]
  },
  strength: {
    title: '兵力部署',
    red: [
      { label: '自杀无人机' },
      { label: '机器狗' },
      { label: '空警-500' },
      { label: '登陆艇' },
      { label: 'XX卫星' },
      { label: 'UVA' },
      { label: '无侦-7' },
      { label: '无侦-8' },
      { label: '攻击-11' },
      { label: '攻击-2' },
      { label: '潜航器' }
    ],
    blue: [
      { label: 'hawk导弹防御系统' },
      { label: 'F-16' },
      { label: '岸防炮' },
      { label: '地面雷达' },
      { label: '导弹车' },
      { label: '地空导弹' }
    ]
  },
  flow: {
    title: '执行流程',
    task: [
      {
        name: '前期压制',
        personnels: [
          { label: 'KJ-500', num: 1 },
          { label: '九天无人机', num: 2 },
          // { label: '九天无人机2' },
          { label: '蜂群自杀式无人机', num: 100 }
          // { label: '蜂群自杀式无人机2' },
        ],
        described: '投放无人机蜂群，消耗台军防空火力'
      },
      {
        name: '掠扫侦察',
        personnels: [
          { label: 'KJ-500', num: 1 },
          { label: 'WZ-8', num: 4 },
          // { label: 'WZ-8_2' },
          { label: 'WZ-10', num: 4 }
          // { label: 'WZ-10_2' },
        ],
        described: '无人化攻击，夺占要点'
      },
      {
        name: '中期压制',
        personnels: [
          { label: 'KJ-500', num: 1 },
          { label: 'WZ-7', num: 4 }
          // { label: '九天无人机2' },
          // { label: '蜂群自杀式无人机2' },
          // { label: '蜂群自杀式无人机2' },
        ],
        described: '综合侦察、精密筹划'
      },
      {
        name: '防空摧毁',
        personnels: [
          { label: 'KJ-500', num: 1 },
          { label: 'GJ-11', num: 8 },
          // { label: '九天无人机2' },
          { label: 'GJ-2', num: 8 }
          // { label: '蜂群自杀式无人机2' },
        ],
        described: '有人/无人协同, 围剿剩余力量，控制要点'
      }
    ]
  }
}
