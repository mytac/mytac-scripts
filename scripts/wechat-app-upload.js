// 此文件用于小程序发布和提交体验版本
// 命令行配置文档为 https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html#%E8%87%AA%E5%8A%A8%E9%A2%84%E8%A7%88
const path = require('path')
const fs = require('fs')
const readline = require("readline")
const cp = require("child_process")

const CONFIG = {
    CLI_PATH: 'C:/微信web开发者工具/cli.bat',
    PROJECT_PATH: '/workspace/GpWxapp/dist',
    OUTPUT_PATH: '/workspace/GpWxapp/info.json'
}

// open IDE
function init() {
    console.log('Please ensure that you have set server port  correctly and had permission of developer.If you are getting trouble with this uploading process,you can contact with me,my wechat is tac_coolzjz.')
    return new Promise((resolve, reject) => {
        cp.execFile(CONFIG.CLI_PATH, ['-o', CONFIG.PROJECT_PATH], (error, stdout, stderr) => {
            if (error) {
                console.log('Failed to start IDE and open the project.')
                reject(error);
            }
            console.log(stdout);
            resolve();
        })
    })

}

// enter information you want to commit.
function input() {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        rl.question('请输入版本号和备注，以空格分隔： \n', answer => {
            rl.close();
            if (answer.includes(' ')) {
                const [version, comment] = answer.split(' ')
                if ((!version || !comment || !version.length || !comment.length)) {
                    console.log('输入不合法，请重新输入')
                    resolve(input())
                } else {
                    console.log('版本号为：', version, '   备注为：', comment)
                    resolve({ version, comment })
                }
            } else {
                reject('请重新输入')
            }
        })
    })
}

// upload your code.
function upload(version, comment) {
    return new Promise((resolve, reject) => {
        const cmd = `cli -u ${version}@${CONFIG.PROJECT_PATH} --upload-desc ${comment}`
        cp.execFile(CONFIG.CLI_PATH, cmd.split(' '), (error, stdout, stderr) => {
            if (error) {
                console.log('Failed to start IDE and open the project.')
                reject(error);
            }
            console.log(stdout);
            resolve();
        })
    })
}

async function main() {
    try {
        await init();
        const { version, comment } = await input();
        await upload(version, comment)
    } catch (e) {
        console.log('e', e)
    }
}

main();
