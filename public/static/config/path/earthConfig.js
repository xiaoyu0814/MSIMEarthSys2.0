
let ExtendEarth;
/**
 * 文件内用于配置球体上的各种配置参数以及构建图元的参数等
 */
// 辉光效果初始参数配置
const viewModel = {
    show: true,
    glowOnly: false,
    contrast: 128,
    brightness: 0.1,
    delta: 2.0,
    sigma: 2.78,
    stepSize: 1.0,
};

// 西北太平洋蓝方军事基地
const militaryBaseBlue = [
    {
        name: '嘉手纳空军基地',
        position: [128.31984455428437, 26.282818023248776],
        id: '嘉手纳'
    },
    {
        name: '岩国空军基地',
        position: [132.6316300870419, 33.401534257136305],
        id: '岩国'
    },
    {
        name: '安德森空军基地',
        position: [145.6012902323775, 14.979268448802111],
        id: '安德森'
    },
    { name: '佐世保海军基地', position: [129.7151101, 33.1799153], id: '佐世保' },
    { name: '横须贺海军基地', position: [139.6722005, 35.2813412], id: '横须贺海军基地' },
    { name: '苏比克基地', position: [120.2397336, 14.7910576], id: '苏比克基地' },
    { name: '关岛基地', position: [144.716667, 13.433333], id: '关岛基地' }
]

// 台湾一二级标注
const taiwan12biaozhu = [
    // 一级
    { coordinate: [121.571952, 25.04131], name: '台北', lv: 1, font: ' bold 26px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 4, displayByDistance: [3e3, 10e5] },
    { coordinate: [121.254598, 25.018261], name: '桃园', lv: 1, font: 'bold 24px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 10e5] },
    { coordinate: [120.652087, 24.17084], name: '台中', lv: 1, font: ' bold 24px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 10e5] },
    { coordinate: [120.192155, 22.996583], name: '台南', lv: 1, font: 'bold 24px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 10e5] },
    { coordinate: [120.316336, 22.627737], name: '高雄', lv: 1, font: 'bold 24px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 10e5] },
    // 二级
    { coordinate: [121.755925, 25.139742], name: '基隆市', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [121.774322, 24.737133], name: '宜兰县', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [120.980939, 24.812723], name: '新竹市', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [120.829161, 24.573194], name: '苗栗县', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [120.553202, 24.084303], name: '彰化县', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [120.70268, 23.908936], name: '南投县', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [120.537104, 23.705802], name: '云林县', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [120.300239, 23.466286], name: '嘉义县', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [121.160312, 22.760041], name: '台东县', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
]
//
const BB12biaozhu = [
    //一级
    { coordinate: [123.5623, 41.9582], name: '沈阳', lv: 1, font: ' bold 26px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 4, displayByDistance: [3e3, 10e5] },
    { coordinate: [125.326095, 43.851465], name: '长春', lv: 1, font: ' bold 26px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 4, displayByDistance: [3e3, 10e5] },
    { coordinate: [126.554115, 43.851465], name: '吉林', lv: 1, font: ' bold 26px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 4, displayByDistance: [3e3, 10e5] },
    //二级
    { coordinate: [122.249147, 43.654767], name: '通辽', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [126.8938, 45.27305], name: '拉林机场', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [123.08, 41.28], name: '辽阳机场', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
    { coordinate: [121.06, 41.10], name: '锦州机场', lv: 2, font: 'bold 20px MicroSoft YaHei', color: [0, 0, 0, 1], outlineColor: [1, 1, 1, 1], outlineWidth: 3, displayByDistance: [3e3, 5e5] },
]

const configText = {
    timeSpeedWarn: '由于当前硬件环境整体性能较低，超过2倍速可能导致系统卡顿，丢失数据'
}

const importantPosition = [
    { name: '苏比克基地', position: [120.2397336, 14.7910576], billboard: 'static/image/billboard/ljb/海军基地蓝.png' },
    { name: '嘉手纳空军基地', position: [127.7691, 26.3563], billboard: 'static/image/billboard/ljb/空军基地蓝.png' },
    { name: '佐世保海军基地', position: [129.7124, 33.1621], billboard: 'static/image/billboard/ljb/海军基地蓝.png' },
    { name: '横须贺海军基地', position: [139.6722005, 35.2813412], billboard: 'static/image/billboard/ljb/海军基地蓝.png' },
    { name: '安德森空军基地', position: [144.9050, 13.5729], billboard: 'static/image/billboard/ljb/空军基地蓝.png' }
]

//重要海峡数据
const importantHaiXiaPosition = [
    { name: '马六甲海峡', position: [101.333333, 2.500000], billboard: 'static/billboard/location.png' },
    { name: '苏伊士运河', position: [33.576936, 28.057775], billboard: 'static/billboard/location.png' },
    { name: '曼德海峡', position: [43.383333, 12.666667], billboard: 'static/billboard/location.png' },
    { name: '宫古水道', position: [125.6722005, 24.5813412], billboard: 'static/billboard/location.png' },
    { name: '巴士海峡', position: [120.8979, 20.9810], billboard: 'static/billboard/location.png' },
    { name: '苏里高海峡', position: [125.3546, 10.1743], billboard: 'static/billboard/location.png' },
    { name: '大隅海峡', position: [130.7104, 30.8895], billboard: 'static/billboard/location.png' },
    { name: '对马海峡', position: [129.6115, 34.1467], billboard: 'static/billboard/location.png' },
    { name: '津轻海峡', position: [140.2211, 41.3161], billboard: 'static/billboard/location.png' },
    { name: '宗谷海峡', position: [141.9565, 45.7436], billboard: 'static/billboard/location.png' },
    { name: '釜山海峡', position: [128.9808, 34.7184], billboard: 'static/billboard/location.png' },
    { name: '巽他海峡', position: [105.7577, -5.9859], billboard: 'static/billboard/location.png' },
    { name: '马鲁古海峡', position: [118.1611, -1.4942], billboard: 'static/billboard/location.png' },
    { name: '冲大东岛', position: [131.2726, 25.8862], billboard: 'static/billboard/location.png' },
    { name: '南海', position: [114.4336, 15.4945], billboard: 'static/billboard/location.png' },
    { name: '台海', position: [122.308333, 23.758333], billboard: 'static/billboard/location.png' },
    { name: '钓鱼岛', position: [123.4760, 25.7462], billboard: 'static/billboard/location.png' },
    { name: '地中海', position: [15.758333, 35.758333], billboard: 'static/billboard/location.png' },
    { name: '菲律宾海', position: [132.3577, 19.6158], billboard: 'static/billboard/location.png' },
    { name: '西北印度洋', position: [62.34, 4.7245], billboard: 'static/billboard/location.png' },
    { name: '爪哇海', position: [112.1670, -5.091], billboard: 'static/billboard/location.png' },
    { name: '廖内群岛', position: [108.1269, 3.7168], billboard: 'static/billboard/location.png' },
    { name: '乐山', position: [121.1258, 24.5341], billboard: 'static/billboard/location.png' },
    { name: '韩国星洲', position: [128.2723, 35.987], billboard: 'static/billboard/location.png' },
    { name: '民都洛海峡', position: [120.1962, 12.6220], billboard: 'static/billboard/location.png' },
    { name: '南沙群岛', position: [114.391667, 10.375000], billboard: 'static/billboard/location.png' },
    { name: '东沙群岛', position: [116.8254, 20.6102], billboard: 'static/billboard/location.png' },
    { name: '西沙群岛', position: [112.7240, 16.6667], billboard: 'static/billboard/location.png' },
    { name: '吕宋岛', position: [121.25609, 16.68356], billboard: 'static/billboard/location.png' },
    { name: '巴拉巴克海峡', position: [116.9842, 7.6161], billboard: 'static/billboard/location.png' },
    { name: '加斯帕海峡', position: [107.1375, -2.8935], billboard: 'static/billboard/location.png' },
    { name: '卡里马塔海峡', position: [108.7744, -2.1374], billboard: 'static/billboard/location.png' },
    { name: '圣贝纳迪诺海峡', position: [-117.18, 34.6], billboard: 'static/billboard/location.png' },
]

// SSE
let EventController = null;

// 扫描时长控制
let identifyDuration = 0.1

// 尾迹插值密度
const wjdistance = 5

// 侦察范围对象
const zflynop = ['wz-10_4', 'wz-10_1', 'wz-10_2', 'wz-10_3']
const zflynop2 = [
    'left_flanker_1',
    'left_flanker_2',
    'left_flanker_3',
    'left_flanker_4'
]
const zflynop3 = ['uav-1', 'uav-2', 'uav-3', 'uav-4']

// 默认不开启 拖拽实体重新定位功能
let isDragPositioning = false
// 快捷键是否可用
let usableControlKeyCode = false
//keycode
let keyCodeObj = {
    // 增加键盘1和2的keycode
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "A": 65,
    "B": 66,
    "C": 67,
    "D": 68,
    "E": 69,
    "F": 70,
    "G": 71,
    "H": 72,
    "I": 73,
    "J": 74,
    "K": 75,
    "L": 76,
    "M": 77,
    "N": 78,
    "O": 79,
    "P": 80,
    "Q": 81,
    "R": 82,
    "S": 83,
    "T": 84,
    "U": 85,
    "V": 86,
    "W": 87,
    "X": 88,
    "Y": 89,
    "Z": 90
}
//配置显示key
let showPanelShow = {
    // 增加键盘1和2的keycode
    "keyboard1": "1",
    "keyboard2": "2",
    "keyboard3": "3",
    "keyboard4": "4",
    "keyboard5": "5",
    //兵力树控制键
    "leftPanelShow": "Q",
    //作战信息面板
    "realTimeInformation": "A",
    //视频面板
    "showVideo": "Z",
    //快速裁决面板
    "quickArbitration": "W",
    //识别结果面板
    "recognitionResult": "S",
    //目标展示面板
    "showTarget": "X",
    //想定面板
    "scenario": "E",
    //战损评估面板
    "statisticAnalysis": "D",
    //任务回传面板
    "taskFeedback": "C",
    //卫星信息
    //"satellite":"Y",
    //干扰机开机面板
    "jammerMeachOn": "V",
    //红方受干扰机干扰显示面板
    "jammerDistrub": "B",
    //干扰机关闭显示面板
    "jammerClose": "N",
    //红方受干扰机干扰显示面板
    "radarRestore": "M",
    //模拟器攻击列表弹框
    "simulatorAttack": "R",
}

// 链路颜色配置
let lineColorConfig = {
    RE_LTrackInit: [255, 0, 0, 0.3],
    RE_LTrackUP: [255, 0, 0, 0.3],
    RE_JamS: [0, 255, 0, 0.3],
    RE_WeaponF: [245, 107, 10, 1],
    RE_WeaponT: [255, 255, 0, 1],
    RE_Network: [136, 8, 1, 0.3]//网络通信
}
//编组颜色配置
let groupColor = {
    group_outlineColor: [255, 0, 0, 0.01],//编组范围边线颜色
    group_labelColor: [255, 255, 0, 1],//编组名称颜色
}
// 基于席位可视化配置参数
let VisParams = {
    flowlineTransparency: 1.0, // 流动先默认透明度
    vectorDataHeight: 1000, // 矢量数据默认高度
    billboardHeight: 4000 // 广告牌默认高度
}
// 加载静态厂家指示
let getStatic = true


let MSIMEarthCZMLProcessContainer;
//设置2D模式下相机最大、最小纬度范围
let camearBoundary2D = {
    maxLat: 74,
    minLat: -74,
    minLatCartesian3: -4966975.251546297,
    maxLatCartesian3: 4966975.251546297,
    setLimit: false//是否开启相机视角范围限制
}
// 当前演示场景视角
const sceneName = '打击任务环境影响分析' // 台海 北部
const EarthAPP = {
    localSceneInfo: {
        content: "1",
        createTime: "2025-01-23 17:19:47",
        creatorId: 22,
        creatorName: "bfrwzb01",
        factor: null,
        id: "1749702582240038432",
        mark: "111",
        name: "shiyanmingchneg ",
        quota: null,
        scenarioId: 1862683600315482000,
        scenarioName: "1749702582240038432",
        scenarioScriptsPath: "/swarm/run_course.txt",
        simClientId: 1915304478999838700,
        simRunStatus: "4",
        subject: "1",
        target: null,
        unit: "si",
        updateTime: "2025-01-23 17:19:47",
        useCurrentConfig: false
    },
    timeC: 2,
    i: 0,
    timeVal: 1,// 前端自定义延迟时间
    dTime: 2,//延迟时间配置
    weatherBySceneName: ['海空联合作战', '拦截想定-v4.0', '打击蓝方导弹发射阵地', '海空联合作战(旧)', '想定-辽东', '想定-宫古控制区制权', '宫古控制区', '小体系对抗-宫古控制区',],//根据场景名称来判断是否加载天气数据
    qbXiaoxiBySceneName: ['ZC预警场景-1.0'],//qb席位 消息
    seatRoute: ['评估席位'],//席位路由
    labelCollection: null,
    //雷达干扰集合
    grjh: [
        { name: 'YTG-9', state: true }
    ],
    // 小体系
    ldrw: [ // LD演示场景各个仿真平台任务划分
        // blue
        { description: '运通干-9', state: '（模拟EC-130飞机）建立干扰阵位以夺取制电磁权', side: 'blue' },
        { description: '空警-500', state: '（模拟E-2C飞机）提供战场态势并充当空中指挥部', side: 'blue' },
        { description: '歼-20-a1-2', state: '（模拟F35-A）协同4架歼-11B飞机（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-20-a2-2', state: '（模拟F35-A）协同4架歼-11B飞机（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-20-a3-2', state: '（模拟F35-A）协同4架歼-11B飞机（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-20-a4-2', state: '（模拟F35-A）协同4架歼-11B飞机（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-20-a5-2', state: '（模拟F35-A）协同4架歼-11B飞机（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-20-a6-2', state: '（模拟F35-A）协同4架歼-11B飞机（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-11B-a1-2', state: '（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-11B-a2-2', state: '（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-11B-a3-2', state: '（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-11B-a4-2', state: '（模拟F-16V飞机）伺机越线前出打击红方补给舰', side: 'blue' },
        { description: '歼-11B-4', state: '智能化虚兵，携带武器，可对红方飞机进行打击', side: 'blue' },
        { description: '歼-11B-5', state: '智能化虚兵，携带武器，可对红方飞机进行打击', side: 'blue' },
        { description: '歼-11B-6-1', state: '智能化虚兵，可进行躲避', side: 'blue' },
        { description: '歼-11B-7-1', state: '智能化虚兵，可进行躲避', side: 'blue' },
        { description: 'F-16V-a1', state: '伺机越线前出打击红方补给舰', side: 'blue' },
        { description: 'F-16V-a2', state: '伺机越线前出打击红方补给舰', side: 'blue' },
        { description: 'F-16V-a3', state: '伺机越线前出打击红方补给舰', side: 'blue' },
        { description: 'F-35A-a1', state: '协同F-16V飞机伺机越线前出打击红方补给舰', side: 'blue' },
        { description: 'F-35A-a2', state: '协同F-16V飞机伺机越线前出打击红方补给舰', side: 'blue' },
        { description: 'F-35A-a3', state: '协同F-16V飞机伺机越线前出打击红方补给舰', side: 'blue' },
        { description: 'blue-F35A-b1', state: '携带无人机伺机越线前出打击', side: 'blue' },
        { description: 'EF-18G', state: '建立干扰阵位以夺取制电磁权', side: 'blue' },
        { description: 'E-2C', state: '提供战场态势并充当空中指挥部', side: 'blue' },
        // red
        { description: '运侦-9', state: '建立侦察阵位以掌握蓝方动向', side: 'red' },
        { description: '运干-9', state: '建立干扰阵位', side: 'red' },
        { description: '空警-500H', state: '建立预警阵位', side: 'red' },
        { description: '歼-11B-1-1', state: '对蓝方地导进行突击以保障己方飞行安全', side: 'red' }, // 对我放飞机进行伴飞护航
        { description: '歼-11B-2-1', state: '对蓝方地导进行突击以保障己方飞行安全', side: 'red' },
        { description: '歼-11B-3-1', state: '保持空中警戒', side: 'red' },
        { description: '歼-11B-4-1', state: '保持空中警戒', side: 'red' },
        { description: '歼-20-3-1', state: '保持2小时制空权，屏护三艘补给舰航行通道安全', side: 'red' },
        { description: '歼-20-4-1', state: '保持2小时制空权，屏护三艘补给舰航行通道安全', side: 'red' },
        { description: '歼-20-5-1', state: '保持2小时制空权，屏护三艘补给舰航行通道安全', side: 'red' },
        { description: '歼-20-6-1', state: '保持2小时制空权，屏护三艘补给舰航行通道安全', side: 'red' },
        { description: '歼-11B-5-1', state: '保持2小时制空权，屏护三艘补给舰航行通道安全', side: 'red' },
        { description: '歼-11B-6-1', state: '保持2小时制空权，屏护三艘补给舰航行通道安全', side: 'red' },
        { description: '歼-11B-7-1', state: '保持2小时制空权，屏护三艘补给舰航行通道安全', side: 'red' },
        { description: '歼-11B-8-1', state: '保持2小时制空权，屏护三艘补给舰航行通道安全', side: 'red' },
        { description: 'Y8', state: '演练模拟器虚实对抗能力', side: 'red' },// 演练模拟器虚实对抗能力
        { description: 'Y9', state: '演练模拟器虚实对抗能力', side: 'red' },// 演练模拟器虚实对抗能力 锦州起飞运输物资
        //  演练教10模拟器从锦州机场起飞，打击蓝方靶机
        { description: '教10', state: '演练模拟器参与小体系对抗', side: 'red' }, //虚实对抗：演练模拟器虚实对抗及护航伴飞能力。低空飞行：演练模拟器低空飞行训练。小体系：演练模拟器参与小体系对抗。  锦州机场起飞对运-8进行伴飞保护
        { description: '歼-20-1-1', state: '保持空中警戒', side: 'red' },
        { description: '歼-20-2-1', state: '保持空中警戒', side: 'red' },
        { description: 'H6K', state: '携带鹰击63反舰导弹对蓝方驱逐舰进行打击', side: 'red' },
        { description: '<dis>2:3:15', state: '演练模拟器虚实对抗能力', side: 'red' }, //H6H
        { description: '金刚级驱逐舰', state: '携带标准3防空导弹对红方飞机进行打击', side: 'red' },
        // { description: '071D-1', state: '携带标准3防空导弹对红方飞机进行打击', side: 'red' },
        // { description: '071D-2', state: '携带标准3防空导弹对红方飞机进行打击', side: 'red' },
        // { description: '075D', state: '携带标准3防空导弹对红方飞机进行打击', side: 'red' },
    ],
    LH: [
        { description: 'WZ-7-1', state: '建立侦察阵位以掌握蓝方动向', side: 'red' },
    ],
    elementArr: [],
    //场景视角
    sceneCamera: {
        // 北部
        // x: -3137611.7825954794,
        // y: 4334491.708945934,
        // z: 4892497.765974688,
        // h: 8.881784197001252e-16,
        // p: -1.5707196507099614,
        // 台海
        // x: -3789803.3103682054,
        // y: 5117360.61601067,
        // z: 3019074.4064409854,
        // h: 6.283185307179581,
        // p: -1.570644903601751,
        // r: 0,
        // 北半球
        x: -5802498.680644467,
        y: 9034565.731802423,
        z: 8144186.419527138,
        h: 6.283185307179581,
        p: -1.5699992467198296,
        r: 0,
        isShow: true,
        duration: 0
    },
    fps: 30,
    // czml 模板
    // "clock": {
    //     "currentTime": "2027-05-30T12:00:00Z",
    //     "multiplier": 1,
    //     "range": "CLAMPED",
    //     "interval": "2027-05-30T12:00:00Z/2027-05-30T13:00:00Z"
    // },
    czmlMB: [
        {
            "id": "document",
            "version": "1.0",
        },
        {
            "id": "Vehicle",
            "availability": "2027-05-30T12:00:00Z/2027-05-30T13:00:00Z",
            "orientation": {
                "velocityReference": "#position"
            },
            "position": {
                "interpolationAlgorithm": "LAGRANGE",
                "interpolationDegree": 1,
                "epoch": "2027-05-30T12:00:00Z",
                "cartographicDegrees": [
                ]
            }
        }
    ],
    SIMInfoCount: 0,
    SIMInfoMaxValue: 10,
    DeleteModelIDConfig: 'DeleteModel', //PD删除事件调用的createClearEntity方法内的id后缀
    //根据不同场景配置教10的任务
    taskContent: {
        '小体系对抗-宫古控制区': '演练模拟器参与小体系对抗',
        '虚实对抗训练': '演练模拟器虚实对抗能力',
        '超低空飞行': '演练模拟器低空飞行训练',
    },
    // 模拟器id列表
    MNQList: [
        '<dis>2:3:10',
        '<dis>2:3:12',
        '<dis>2:3:13',
        '<dis>2:3:15',
    ],
    // MNQ导弹
    MNQDDList: [
        '<dis>2:3:132',
        '<dis>2:3:131'
    ],
    // 弹移除延迟时间
    DDDelayTime: 500,
    // 各种弹之外平台移除延误时间
    PTDelayTime: 1000,
    // 爆炸效果尺寸控制
    boomSize: 10,
    towthousand: '测试01',//2000个目标的场景名称
    logoTitle: '白方导调控制席',// logo旁显示的标题，例如席位标题，如果不配置则根据系统逻辑选择
    systemTitle: '数据资源中心-导调控制席',//'仿真推演', //系统标题，如果不配置则根据系统逻辑选择
    loginTitle: '', //登录页标题
    baseModelUrl: 'static/data/gltf/', //默认本地，当后台布置好模型后直接读取后台的地址
    entitiesCount: 0,
    currentTaskName: null, //配置当前选中场景后在导航栏中央下部显示的场景名称
    plateformStatistic: {
        PAStatistic: ['TARGET', 'RadarSite150km', 'Building', 'THAAD_LAUNCHER', 'HAWK_Launcher', 'HQ-16A_Vehicle', 'HQ-9B_Vehicle', 'TARGET'],
        yr: [
            'TANK',
            'ZBD-05A',
            "DestroyerBurke",
            "Destroyer052D",
            "Destroyer055",
            "Carrier003",
            "CruiserTiconderoga",
            "CarrierNimitz",
            "LSD071",
            "LHA076",
            "LHA075",
            "LandingCraft",
            "AOE901",
            "H-6K",
            "KJ-600",
            "J-20ISC",
            "J-20A",
            "J-20",
            "J-16D",
            "J-15T",
            "J-11B",
            "YY-20",
            "FA-18E",
            "F-35C",
            "F-35A",
            "F-16V",
            "F-15J",
            "EA-18G",
            "E-2D",
            "Z-10",
            "Z-8"],
        wr: [
            "Orca_LDUUV",
            "HSU-001_LDUUV",
            "KVD-001",
            "GJ-2",
            "GJ-11",
            "WZ-7",
            "SS-UAV",
            "CLIENT_SUICIDE_DRONE",
            "LEADER_SUICIDE_DRONE",
            "AttackMechDog",
            "TransportMechDog",
            "UnmannedMilitaryVehicle"
        ],
        fk: [
            "THAAD_LAUNCHER",
            "HQ-16A_Vehicle",
            "HQ-9B_Vehicle",
            "HAWK_Launcher",
            "RadarSite150km",
            'HAWK_Launcher',
            'TARGET',
            'TANK'
        ]
    },
    Copyright: 'Copyright © 2025 XXXXXXXXXXXXXXXX 版权所有', //首页底部Copyright 国防大学联合作战学院联合参谋系
    Version: '系统版本：v1.5.3', //首页底部版本号
    xdyBLShow: false,//想定也兵力信息显隐
    isBottomPermisson1: true, //编组
    isBottomPermisson2: true, //作战信息
    isBottomPermisson3: true, //计划导调
    isBottomPermisson4: true, //场景配置
    isBottomPermisson5: true, //专题分析
    sysTitle: '复杂场景多域联合无人智能作战平行推演系统',//'智能作战概念创新运用支持系统', //系统主要标题 //XXXX仿真推演系统 //XXXX仿真推演与强化学习训练平台
    sysTitleQZ: '无人',// 系统标题前缀，用于切换版本，在系统配置里加上切换按钮，需要加上无人时标题使用sysTitleQZ+ sysTitle
    showGRD: true, //控制是否显示干扰弹
    shouldAnimateConfig: false, //暂停开始时是否配置shouldAnimate属性
    pauseConfig: false, //也是控制暂停开始
    reLink: true, //重连SSE
    useSSE: false, //是否使用SSE
    MQCount: 0,//每次进入页面记录连接MQ次数，从0此开始，刷新后重置
}
//机场数据
const airPorts = [{
    // name: 'liulin',
    // labelName: '柳林',
    // lon: 131,
    // lat:31,
    // alt:100,
    // side:'red'
}]

// 雷达开启/关闭雷达遮罩
let radarRenderConfig = [
    { radarName: 'BB_threat-radio', radarState: true },
    { radarName: 'BB_SAT_GS-LAX', radarState: true },
    { radarName: '300_ew_radar', radarState: true },
    { radarName: 'BB_SAT_GS-BlueSTL', radarState: true },
    { radarName: 'BB_SAT_GS-BlueLAX', radarState: true },
    { radarName: '200_ew_radar', radarState: true },
    { radarName: 'blue_ew_radar', radarState: false },
    { radarName: 'ew_radar', radarState: false },
    { radarName: 'ACQ_RADAR_site21101c14c5d_sensor_command_radar', radarState: false },
    { radarName: 'ACQ_RADAR_site2110149b6cf_sensor_command_radar', radarState: false },
    { radarName: 'ACQ_RADAR_site21101238b4f_sensor_command_radar', radarState: false },
    { radarName: 'HAWK_RadarPA', radarState: false },
    { radarName: 'Hawk_Radar1PA', radarState: false },
    { radarName: 'Hawk_Radar2PA', radarState: false },
    { radarName: 'Hawk_Radar3PA', radarState: false }
]

let indexedDBController = null

let cameraOption = null
let frustumFalseArr = []
let hsyz = ['flight_lead_south', '200_ew_radar', 'BlueArtillery4', 'Hawk_Radar1', 'Hawk1']
let reComputetTimeC = true

// 平台传感器开关显示合集，主要是为了凸显场景中某些特定探测效果（后续由AFSIM控制显示）
let sensorPlateformArr = ['YAOGAN','OpticalSatellite-1','OpticalSatellite-2','WZ-7-2', 'CH-5-2','DF-15C_Vehicle1_DF-15C_1','DF-15C_Vehicle2_DF-15C_1','M142_1','Hawk_Radar1']

// 传感器配置参数，暂时本地保存，后续由后台服务或者仿真端提供，需要注意的仿真引擎可是段界面展示的包络范围和实际拿到的参数并不一致，渲染时需要额外处理
let plateformVolumeConfig = [
    {
        type: 'WZ-7', config: {
            sensorType: 'CCD', volume: {
                "AzimuthMax": 3.141592653589793,
                "AzimuthMin": -3.141592653589793,
                "ElevationMax": 1.5707963267948966,
                "ElevationMin": -1.5707963267948966,
                "FOVAzimuthMax": 0.0973893722612836,
                "FOVAzimuthMin": -0.0973893722612836,
                "FOVElevationMax": 0.0973893722612836,
                "FOVElevationMin": -0.0973893722612836,
                "RangeMax": 30000,
                "RangeMin": 0
            }
        }
    },
    {
        type: 'CH-5', config: {
            sensorType: 'CCD', volume: {
                "AzimuthMax": 3.141592653589793,
                "AzimuthMin": -3.141592653589793,
                "ElevationMax": 1.5707963267948966,
                "ElevationMin": -1.5707963267948966,
                "FOVAzimuthMax": 0.0973893722612836,
                "FOVAzimuthMin": -0.0973893722612836,
                "FOVElevationMax": 0.0973893722612836,
                "FOVElevationMin": -0.0973893722612836,
                "RangeMax": 30000,
                "RangeMin": 0
            }
        }
    }
]

// 兵力态势图是否显示
let forceMapShow = false
