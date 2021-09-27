"use strict";(self.webpackChunktokamak_docs=self.webpackChunktokamak_docs||[]).push([[709],{8968:function(t,e,a){a.r(e),a.d(e,{frontMatter:function(){return r},contentTitle:function(){return p},metadata:function(){return s},toc:function(){return l},default:function(){return d}});var o=a(7462),n=a(3366),i=(a(7294),a(3905)),r={sidebar_position:1},p="Project",s={unversionedId:"getting-started/project",id:"getting-started/project",isDocsHomePage:!1,title:"Project",description:"TokamakJS applications can be developped following two different styles depending on the complexity of the application you're developing. For example, if you're building a small app you might choose to follow a monolitic approach with just a single sub-app or, for more complex applications or applications that can be easily subdividded, you might choose a fractal approach instead where you have the application divided in multiple sub-apps, each of them well scoped and defined.",source:"@site/docs/getting-started/project.md",sourceDirName:"getting-started",slug:"/getting-started/project",permalink:"/tokamakjs/docs/getting-started/project",editUrl:"https://github.com/tokamakjs/tokamak-docs/edit/master/docs/getting-started/project.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/tokamakjs/docs/introduction"},next:{title:"Routing and Routes",permalink:"/tokamakjs/docs/getting-started/routing"}},l=[{value:"First Steps",id:"first-steps",children:[]},{value:"Running the Application",id:"running-the-application",children:[]}],c={toc:l};function d(t){var e=t.components,a=(0,n.Z)(t,["components"]);return(0,i.kt)("wrapper",(0,o.Z)({},c,a,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"project"},"Project"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"TokamakJS")," applications can be developped following two different styles depending on the complexity of the application you're developing. For example, if you're building a small app you might choose to follow a ",(0,i.kt)("strong",{parentName:"p"},"monolitic approach with just a single sub-app")," or, for more complex applications or applications that can be easily subdividded, you might choose a ",(0,i.kt)("strong",{parentName:"p"},"fractal approach instead where you have the application divided in multiple sub-apps"),", each of them well scoped and defined."),(0,i.kt)("p",null,"Important to not that a specific folder structure is not enforced. It is recommended howerver in any case to follow the style used in this guide as this will allow you to also benefit from the different generators available through the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/tokamakjs/tokamak-cli"},"CLI"),"."),(0,i.kt)("h2",{id:"first-steps"},"First Steps"),(0,i.kt)("p",null,"The esiest way to get started with ",(0,i.kt)("strong",{parentName:"p"},"TokamakJS")," is using the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/tokamakjs/tokamak-cli"},"CLI")," to create a new project using and running the following commands:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"tok new project-name\n")),(0,i.kt)("p",null,"This will create a basic app skeleton together with a bunch of other required files."),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"FILE_TREE")),(0,i.kt)("p",null,"The entry point of our application is the ",(0,i.kt)("inlineCode",{parentName:"p"},"index.ts")," file inside the ",(0,i.kt)("inlineCode",{parentName:"p"},"src")," directory:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { TokamakApp } from '@tokamakjs/react';\n\nimport { AppModule } from './app/app.module';\n\nasync function bootstrap() {\n  const app = await TokamakApp.create(AppModule);\n  app.render('#root');\n}\n\nbootstrap();\n")),(0,i.kt)("p",null,"In this file we have a basic ",(0,i.kt)("inlineCode",{parentName:"p"},"bootstrap")," function that we use to create a new ",(0,i.kt)("strong",{parentName:"p"},"TokamakJS")," instance using the main module of our application. After that, we just render the newly created app. We can also use this function to perform any pre-initialization steps we might need before running the app."),(0,i.kt)("h2",{id:"running-the-application"},"Running the Application"),(0,i.kt)("p",null,"To verify that everything worked correctly during the instalation and initialization step, you can run the newly created app using:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm start\n")),(0,i.kt)("p",null,"This command will start the development server and, after the compilation step finishes, show some information about the app and how can we access it. If everything worked according to plan, if you navigate to the url shown in the terminal where the command above was run, you should see a basic counter app."))}d.isMDXComponent=!0}}]);