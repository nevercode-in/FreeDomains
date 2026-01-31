import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",
  
  title: "isroot.in - docs",
  description: "isroot.in is a free subdomain platform for developers to deploy projects, APIs, and demos instantly—no credit card required.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        
        items: [
          {text:'Home',link:'/'},
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Dns Management', link: '/dns-manage' },
      
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/VIGGU-7/isroot.in' }
    ]
  }
})
