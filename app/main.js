/**
 * Created by Administrator on 2017/1/30.
 */
"use strict";
const {app, BrowserWindow,globalShortcut,ipcMain,dialog} = require('electron');
const path = require('path');
const url = require('url');

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win = null;

let createWindow = () => {
    // 创建浏览器窗口。
    win = new BrowserWindow({width: 1200, height: 600});
    //win.loadURL('http:');
    // 加载应用的 index.html。
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'page/server.html'),
        protocol: 'file:',
        slashes: true
    }));

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    });
    //快捷键
    globalShortcut.register('Esc', () => {
        // Do stuff when Y and either Command/Control is pressed.
        //app.quit();
        win.close();
    });
    //侦听通讯事件
    ipcMain.on('get-app-path',(e)=>{
        e.sender.send('get-app-path',app.getAppPath());
    }).on('closeWindow',(e)=>{
        console.log('start to closeWindow!');
        win.close();
        //e.sender.send('getBrowserWindow',win);
    }).on('showMsg',(e,o)=>{
        switch (o.type){
            case 0://ERROR
                dialog.showErrorBox(o.title||null,o.msg);
                break;
            case 1://SUCCESS
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Information',
                    message: "This is an information dialog. Isn't it nice?",
                    buttons: ['Yes', 'No']
                },(index)=>{
                    //e.sender.send('');
                });
                break;
        }
    }).on('openDev',()=>{
        win.webContents.openDevTools({mode:'bottom'});
    });

};


// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
    app.quit()
}
});

app.on('activate', () => {
    // 在这文件，你可以续写应用剩下主进程代码。
    // 也可以拆分成几个文件，然后用 require 导入。
    if (win === null) {
        createWindow()
    }
});

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。