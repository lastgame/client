/**
 * Created by devin on 2017/2/21.
 * 菜单
 */
const menuTemplate = [
    {
        label: '工具箱',
        submenu: [
            {
                label:'重新加载',
                role: 'reload'
            },
            {
                label:'调试窗口',
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                label:'还原大小',
                role: 'resetzoom'
            },
            {
                label:'放大页面',
                role: 'zoomin'
            },
            {
                label:'缩小页面',
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                label:'全屏',
                role: 'togglefullscreen'
            }
        ]
    },
    {
        label:'帮助',
        role: 'help',
        submenu: [
            {
                label: '文档',
                click () { require('electron').shell.openExternal('http://electron.atom.io') }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({
        label: app.getName(),
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    });
    // Edit menu.
    menuTemplate[1].submenu.push(
        {
            type: 'separator'
        },
        {
            label: 'Speech',
            submenu: [
                {
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        }
    );
    // Window menu.
    menuTemplate[3].submenu = [
        {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        },
        {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: 'Zoom',
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            label: 'Bring All to Front',
            role: 'front'
        }
    ]
}
module.exports = menuTemplate;