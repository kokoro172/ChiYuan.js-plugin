/*
 * @Author: WangKeWei172
 * @Date: 2022/12/2
 *
 */

import plugin from "../../lib/plugins/plugin.js";
import common from "../../lib/common/common.js";
import schedule from "node-schedule";
import {Group, segment, Message} from "oicq";


/*
 * 使用的是cron表达式，每周六的9点和19点提醒
 * 可以百度搜索转换器
 */
const alertTime = "0 0 9,19 ? ? 7";

//const alertTime = "0 0/2 * * * ?"; //测试时间，每2分钟执行

/**
 * 开启定时推送的群号：
 * 一个群号：
 * groupList = ["114514"];
 * 两个群号：
 * groupList = ["114514","1919810"];
 * 不加双引号只能填入一个群，否则不会执行任务
 */
const groupList = [];

weeklyRemindMeeting();    //开启定时提醒任务，注释掉可以关闭

/**
 * 其实我也不会写这个函数，照着众多插件的函数改的
 * 算是勉强弄明白了使用方法
 * 总之这是定义了一个事件（在这里为赤鸢提醒）
 */
export class duckImg extends plugin {
    constructor() {
        super({
            name: "赤鸢提醒",
            dsc: "根据cron表达式提醒全体成员",
            /** https://oicqjs.github.io/oicq/#events */
            event: "message.group",
            priority: 1000,
            rule: [
                {
                    /** 命令匹配 */
                    reg: "今晚8点开会",
                    /** 执行方法 */
                    fnc: "remindMeeting"
                }
            ]
        });
    }
}



/**
 * 定时提醒任务
 *
 */
function weeklyRemindMeeting(){
    schedule.scheduleJob(alertTime, () =>{
        for(var i = 0; i < groupList.length; i++){
            let group = Bot.pickGroup(groupList[i]);
            remindMeeting(group);       //提醒
            common.sleep(3000)   //休眠3s，接着发下一个群
        }
    })
}

/**
 * @param e
 * @returns {Promise<void>}
 *
 * 提醒开会函数
 */
async function remindMeeting(e){
    let text = "今晚8点开会哟~";  /**文案*/
    let msg = [];   //建立msg数组

    if (e instanceof Group){
        msg = [segment.at("all"), text];
    }
    else{
        msg.unshift(text);
    }
    e.sendMsg(msg);    //发送文案
}

