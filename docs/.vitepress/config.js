export default {
  title: '程序员的笔记',
  description: '记录工作学习中遇到的技术问题',
  head: [
    // 改变title的图标
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',//图片放在public文件夹下
      },
    ],
  ],
  themeConfig: {
    nav: [
      // This link gets active state when the user is
      // on `/config/` path.
      {
        text: 'Nginx',
        link: '/nginx/',
        activeMatch: '/nginx'
      }
    ],
    sidebar: {
      '/nginx/':[
        {
          text: 'Nginx实战',
          collapsible: true,
          items: [
            { text: 'Nginx 配置 https', link: '/nginx/index.html' }
          ]
        }
      ]
    }
  }
}
