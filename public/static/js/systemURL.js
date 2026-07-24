/*
 * @Author: 10.15.15.11 root@pie.cn
 * @Date: 2024-07-10 20:39:50
 * @LastEditors: ZX Li
 * @LastEditTime: 2026-01-07 17:33:40
 * @FilePath: \MSIMEarthSysN\public\static\js\systemURL.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const serverIp = 'http://10.15.2.11:6060/PublicServicePlatform/#/'
const PIEIp = "http://10.15.2.11:6060/"
const systemUrlList = [{
  name_CN: '实验资源管理分系统',
  name_US: 'deliberateEditor',
  className: 'navItem',
  url: ''
},
{
  name_CN: '实验准备分系统',
  name_US: 'taskRehearsal',
  className: 'allSituation',
  url: `${PIEIp}PlotApp/#/`
},
{
  name_CN: '环境影响仿真推演及态势多维呈现',
  name_US: 'zhikongtuiyanpingguxitong',
  className: 'sceneEditing',
  url: `${PIEIp}plot-draw/#/`
},
{
  name_CN: '实验数据分析分系统',
  name_US: 'trainingDataManagement',
  className: '',
  url: `${PIEIp}trainingManagement/#/`
},
{
  name_CN: '概念多维呈现分系统',
  name_US: 'missionPreparation',
  className: 'navItem',
  url: `${serverIp}`
}]
// const experimentalPreparation = "http://192.168.1.100/SAAEdit/#/"; //实验准备分系统
// const experimentalResourceManagement = "http://192.168.1.100/ExperimentalManagementSubsys/#/home/battlefield"//实验资源管理分系统
// const HomeUrl = "http://10.15.2.12:6060/dist/#/"
// const experimentalStatics = "http://192.168.1.100/MSIMEarthSys1.3/#/infomationStatistics"; //实验数据统计分系统
// const experimentalSimulation = '/home/combatSimulation' //仿真实验分系统
// const experimentalReview = '/review' //仿真实验分系统

// 开发
// const experimentalPreparation = "http://localhost:8081/#/"; //实验准备分系统
// const experimentalResourceManagement = "http://localhost:8082/#/home/"//实验资源管理分系统
// const HomeUrl = "http://10.15.2.12:6060/dist/#/"
// const experimentalStatics = "http://localhost:8080/#/infomationStatistics"; //实验数据统计分系统
// const experimentalSimulation = '/home/combatSimulation' //仿真实验分系统
// const experimentalReview = '/review' //复盘

