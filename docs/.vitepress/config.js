export default {
  title: '程序员的笔记',
  description: '记录工作学习中遇到的技术问题',
  head: [
    // 改变title的图标
    [
      'link', { rel: 'icon', href: '/favicon.ico', },
    ],
    [
      'link', { rel: 'stylesheet', href: '/main.css', },
    ]
  ],
  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/',
        activeMatch: ''
      },
      {
        text: 'Nginx',
        link: '/nginx/',
        activeMatch: '/nginx'
      },
      {
        text: 'Elastic-Stack',
        link: '/elastic-stack/',
        activeMatch: '/elastic-stack'
      },
      {
        text: 'Redis',
        link: '/redis/',
        activeMatch: '/redis'
      }
    ],
    sidebar: {
      '/nginx/': [
        {
          text: 'Nginx实战',
          collapsible: true,
          items: [
            { text: 'Nginx 配置 https', link: '/nginx/index.html' }
          ]
        }
      ],
      '/elastic-stack/': [
        {
          text: 'ElasticStack 相关部署',
          collapsible: true,
          items: [
            { text: 'ES、Kibana 部署', link: '/elastic-stack/index.html' }
          ]
        },
        {
          text: 'ElasticStack 进阶调优',
          collapsible: true,
          items: [
            { text: 'reindex', link: '/elastic-stack/reindex.html' }
          ]
        }
      ],
      '/redis/': [
        {
          text: 'Redis 进阶',
          collapsible: true,
          items: [
            { text: 'Redis 实现排行榜', link: '/redis/index.html' }
          ]
        }
      ]
    }
  }
}
