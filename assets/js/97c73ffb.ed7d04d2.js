"use strict";(self.webpackChunktokamak_docs=self.webpackChunktokamak_docs||[]).push([[19],{8391:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return p},default:function(){return c}});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),i={sidebar_position:3},s="Providers",l={unversionedId:"getting-started/providers",id:"getting-started/providers",isDocsHomePage:!1,title:"Providers",description:"Providers are the fundamental building block in TokamakJS. You can think of a provider as a self contained piece of business logic that can be used by other parts of the application in a clear and declarative way. Providers come in all sort of different shapes, anything that is not a controller or a view is gonna be a provider in one way or another. However, most of the time a provider is just a class annotated with either @Injectable() or @HookService().",source:"@site/docs/getting-started/providers.md",sourceDirName:"getting-started",slug:"/getting-started/providers",permalink:"/tokamakjs/docs/getting-started/providers",editUrl:"https://github.com/tokamakjs/tokamak-docs/edit/master/docs/getting-started/providers.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Routing and Routes",permalink:"/tokamakjs/docs/getting-started/routing"},next:{title:"Modules and SubApps",permalink:"/tokamakjs/docs/getting-started/modules_and_subapps"}},p=[{value:"Injectables",id:"injectables",children:[]},{value:"Hook services",id:"hook-services",children:[]},{value:"Adding providers to the app",id:"adding-providers-to-the-app",children:[]},{value:"Custom providers",id:"custom-providers",children:[{value:"Value providers",id:"value-providers",children:[]},{value:"Class providers",id:"class-providers",children:[]},{value:"Factory providers",id:"factory-providers",children:[]}]},{value:"Global Providers",id:"global-providers",children:[]}],d={toc:p};function c(e){var t=e.components,n=(0,o.Z)(e,["components"]);return(0,r.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"providers"},"Providers"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Providers")," are the fundamental building block in ",(0,r.kt)("strong",{parentName:"p"},"TokamakJS"),". You can think of a provider as a self contained piece of business logic that can be used by other parts of the application in a clear and declarative way. Providers come in all sort of different shapes, anything that is not a ",(0,r.kt)("strong",{parentName:"p"},"controller")," or a ",(0,r.kt)("strong",{parentName:"p"},"view")," is gonna be a ",(0,r.kt)("strong",{parentName:"p"},"provider")," in one way or another. However, most of the time a provider is just a class annotated with either ",(0,r.kt)("inlineCode",{parentName:"p"},"@Injectable()")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"@HookService()"),"."),(0,r.kt)("p",null,"The main idea behind a provider is that they can be injected as dependencies into other components of the application leaving all the class instantiation and wiring to the ",(0,r.kt)("strong",{parentName:"p"},"TokamakJS")," runtime. This is achieved using a technique called ",(0,r.kt)("a",{parentName:"p",href:"https://wiki2.org/en/Dependency_injection"},"dependency injection"),"."),(0,r.kt)("h2",{id:"injectables"},"Injectables"),(0,r.kt)("p",null,"The simplest way of creating a provider is decorating a plain class with the ",(0,r.kt)("inlineCode",{parentName:"p"},"@Injectable()")," decorator. This marks the class as ready to be injected as dependency into other providers or controllers."),(0,r.kt)("p",null,"Services and API classes are good candidates to be injected this way since they should not interact with React logic and usually are instantiated once when starting up the application and then, re-used."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Injectable } from '@tokamakjs/react';\n\n@Injectable()\nexport class CounterApi {\n  public async saveValue(value: number): Promise<void> {\n    // implementation...\n  }\n}\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Injectable } from '@tokamakjs/react';\n\nimport { CounterApi } from '../api';\n\n@Injectable()\nexport class CounterService {\n  // CounterApi will be injected automatically\n  constructor(private readonly _api: CounterApi) {}\n\n  public async saveValue(value: number): Promise<void> {\n    // implementation...\n  }\n}\n")),(0,r.kt)("p",null,"By default, classes decorated with ",(0,r.kt)("inlineCode",{parentName:"p"},"@Injectable()")," are instantiated as ",(0,r.kt)("a",{parentName:"p",href:"https://wiki2.org/en/Singleton_pattern"},"singletons"),". It's possible however to change this behavior by setting a different ",(0,r.kt)("inlineCode",{parentName:"p"},"scope")," when decorating the class. E.g."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Injectable, Scope } from '@tokamakjs/react';\n\n@Injectable({ scope: Scope.TRANSIENT })\nexport class CounterApi {\n  public async saveValue(value: number): Promise<void> {\n    // implementation...\n  }\n}\n")),(0,r.kt)("p",null,"There are two possible values for ",(0,r.kt)("inlineCode",{parentName:"p"},"scope"),":"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"Scope.TRANSIENT"),": A new instance will be created every time the provider is injected as a dependency."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"Scope.SINGLETON")," ",(0,r.kt)("em",{parentName:"li"},"(default)"),": An instance will be created at startup and re-used every time the provider is injected as a dependency.")),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"If you used the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/tokamakjs/cli"},"CLI")," to bootstrap your project, you can easily create an API class using ",(0,r.kt)("inlineCode",{parentName:"p"},"npx tok generate api [ClassName]"),". In the same way, you can create services as well using ",(0,r.kt)("inlineCode",{parentName:"p"},"npx tok generate service [ClassName]"),"."))),(0,r.kt)("p",null,"To be able to use the created providers in the application, don't forget to add them to the ",(0,r.kt)("inlineCode",{parentName:"p"},"providers")," array in either ",(0,r.kt)("inlineCode",{parentName:"p"},"@Module()")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"@SubApp()"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { SubApp } from '@tokmamakjs/react';\n\nimport { CounterController } from './routes/counter';\nimport { CounterApi } from './api';\nimport { CounterService } from './services';\n\n@SubApp({\n  routing: [createRoute('/', CounterController)],\n  providers: [CounterApi, CounterService],\n})\nexport class AppModule {}\n")),(0,r.kt)("p",null,"After the providers have been added to the ",(0,r.kt)("inlineCode",{parentName:"p"},"@SubClass()")," we can use them in our controllers (or in others providers as shown above) simply by declaring them as dependencies in the ",(0,r.kt)("inlineCode",{parentName:"p"},"constructor()"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Controller, state, effect } from '@tokamakjs/react';\n\nimport { CounterService } from '../../services';\nimport { CounterView } from './counter.view';\n\n@Controller({ view: CounterView })\nexport class CounterController {\n  @state private readonly _value = 0;\n\n  get value() {\n    return this._value;\n  }\n\n  // CounterService is injected automatically\n  constructor(private readonly _counterService: CounterService) {}\n\n  // Track and save value every time it changes)\n  @effect((self: CounterController) => [self.value]))\n  protected async saveValue(): Promise<void> {\n    // We can use the injected provider like any other property\n    await this._counterService.saveValue(this._value);\n  }\n\n  public increase(): void {\n    this._value += 1;\n  }\n}\n")),(0,r.kt)("h2",{id:"hook-services"},"Hook services"),(0,r.kt)("p",null,'Sometimes we want to encapsulate some logic related to React and for that, we need to use hooks. As we\'ve seen, services are a really good way of putting closely related logic together in a "easy to use package" ready to be consumed by the rest of the app. However, we cannot use React hooks or the react life-cycle in a regular service since those are instantiated during the startup of the app and hooks are required to always run unconditionally.'),(0,r.kt)("p",null,"To solve this, there's a special type of service that we can declare by using the ",(0,r.kt)("inlineCode",{parentName:"p"},"@HookService()")," decorator. Classes decorated with this decorator allow us to use all the React related decorators that we can use in a controller: ",(0,r.kt)("inlineCode",{parentName:"p"},"@state"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"@effect"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"@onDidMount"),", etc."),(0,r.kt)("p",null,"For example, if we wanted to abstract all the logic about storing the counter value and modifying its value from the controller, we could do the following:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { HookService } from '@tokmamakjs/react';\n\n@HookService()\nexport class CounterHookService {\n  @state private readonly _value = 0;\n\n  get value() {\n    return this._value;\n  }\n\n  public increase(): void {\n    this._counter += 1;\n  }\n\n  public decrease(): void {\n    this._counter -= 1;\n  }\n}\n")),(0,r.kt)("p",null,"And then, use it like a regular provider in our controller:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Controller, state, effect } from '@tokamakjs/react';\n\nimport { CounterService } from '../../services';\nimport { CounterView } from './counter.view';\n\n@Controller({ view: CounterView })\nexport class CounterController {\n  get value() {\n    return this._counter.value;\n  }\n\n  constructor(private readonly _counter: CounterHookService) {}\n\n  public increase(): void {\n    this._counter.increase();\n  }\n\n  public decrease(): void {\n    this._counter.decrease();\n  }\n}\n")),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"The main difference between classes decorated with ",(0,r.kt)("inlineCode",{parentName:"p"},"@Injectable()")," and those decorated with ",(0,r.kt)("inlineCode",{parentName:"p"},"@HookService()")," is that, by default, the later create ephemeral instances, meaning that the class instance will be discarded and re-created during a re-render."))),(0,r.kt)("div",{className:"admonition admonition-warning alert alert--danger"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"warning")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Since classes decorated with ",(0,r.kt)("inlineCode",{parentName:"p"},"@HookService()")," are ephemeral, it's not recommended to store data in regular class properties as that data will get lost with every re-render of the app."))),(0,r.kt)("h2",{id:"adding-providers-to-the-app"},"Adding providers to the app"),(0,r.kt)("p",null,"Adding providers to an app is a simple as adding them to the ",(0,r.kt)("inlineCode",{parentName:"p"},"providers")," array in either a ",(0,r.kt)("inlineCode",{parentName:"p"},"@SubApp()")," or a ",(0,r.kt)("inlineCode",{parentName:"p"},"@Module()"),". This way, we tell the container that such provider exists and it's ready to be used in the context of that module or sub-app. If we want to expose the provider to be used by other contexts importing our module or sub-app, we have to also add it to the ",(0,r.kt)("inlineCode",{parentName:"p"},"exports")," array."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { SubApp, createRoute } from '@tokamakjs/react';\n\nimport { AUTH_TOKEN } from './constants';\nimport { CounterController } from './routes/counter';\nimport { CounterService, CounterHookService } from './services';\n\n@SubApp({\n  routing: [createRoute('/', CounterController)],\n  providers: [CounterService, CounterHookService],\n  exports: [CounterService], // only CounterService will be available when importing this sub-app\n})\nexport class CounterModule {}\n")),(0,r.kt)("h2",{id:"custom-providers"},"Custom providers"),(0,r.kt)("p",null,"There are other ways of defining providers apart from using the ",(0,r.kt)("inlineCode",{parentName:"p"},"@Injectable()")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"@HookService()")," decorators. These are called custom providers and are an advanced way of using ",(0,r.kt)("strong",{parentName:"p"},"TokamakJS")," dependency injection container. For example, you might want to inject a different class if you're in a test environment, or a class needs some custom initialiation before being able to be used by ",(0,r.kt)("strong",{parentName:"p"},"TokamakJS"),", or you might even need to do some asynchronous operation during the provider initialization."),(0,r.kt)("p",null,"There are three types of custom providers currently supported: ",(0,r.kt)("em",{parentName:"p"},"value providers"),", ",(0,r.kt)("em",{parentName:"p"},"class providers")," and ",(0,r.kt)("em",{parentName:"p"},"factory providers")),(0,r.kt)("h3",{id:"value-providers"},"Value providers"),(0,r.kt)("p",null,"Value provider are useful for injecting a constant value, using a custom instance of a class or just overriding the default value that would be injected by a regular provider."),(0,r.kt)("p",null,"Value providers are objects with the following shape:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"interface ValueProvider {\n  provide: Token;\n  useValue: any;\n}\n")),(0,r.kt)("p",null,"Where ",(0,r.kt)("inlineCode",{parentName:"p"},"Token")," is the injection token used by the container to know which value to inject and ",(0,r.kt)("inlineCode",{parentName:"p"},"useValue")," can be any value that needs to be injected when using this provider. Anything can be used as a token as long as the same value is used when injecting the provider."),(0,r.kt)("p",null,"For example, if we wanted to inject a constant value, we could define our provider like so:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { SubApp } from '@tokamakjs/react';\n\nimport { AUTH_TOKEN } from './constants';\n\n@SubApp({\n  providers: [\n    // AUTH_TOKEN is just a regular const string that help us identify the provider\n    { provide: AUTH_TOKEN, useValue: 'my-auth-token' }\n  ]\n})\nexport class AppModule {}\n")),(0,r.kt)("p",null,"and then use it using the ",(0,r.kt)("inlineCode",{parentName:"p"},"@Inject()")," decorator in the following way:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Controller, state, effect, Inject } from '@tokamakjs/react';\n\nimport { AUTH_TOKEN } from '../../constants';\nimport { CounterView } from './counter.view';\n\n@Controller({ view: CounterView })\nexport class CounterController {\n  constructor(@Inject(AUTH_TOKEN) private readonly _token: string) {}\n\n  public logToken(): void {\n    console.log(this._token); // prints \"my-auth-token\"\n  }\n}\n")),(0,r.kt)("p",null,"Any kind of value can be injected this way, even other instances of classes. For example, let's imagine we wanted to manually take care of instantiating ",(0,r.kt)("inlineCode",{parentName:"p"},"CounterService")," from above:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { SubApp } from '@tokamakjs/react';\n\nimport { CounterService } from './services';\n\n@SubApp({\n  providers: [\n    // We use the class itself as the token so it's without having to use `@Inject()`\n    { provide: CounterService, useValue: new CounterService() }\n  ]\n})\nexport class AppModule {}\n")),(0,r.kt)("h3",{id:"class-providers"},"Class providers"),(0,r.kt)("p",null,"Class providers allow us to override the class that would otherwise be injected. For example, during tests, we might want to replace the real service that does the API calls for a mock one that fake those calls. An example of this would be:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { SubApp } from '@tokamakjs/react';\n\nimport { CounterService, MockCounterService } from './services';\n\n@SubApp({\n  providers: [\n    {\n      provide: CounterService,\n      useClass: process.env.NODE_ENV === 'test' ? MockCounterService : CounterService,\n    },\n  ],\n})\nexport class AppModule {}\n")),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},(0,r.kt)("inlineCode",{parentName:"p"},"@Injectable()")," is just a convenient wrapper over using ",(0,r.kt)("inlineCode",{parentName:"p"},"{ provide: ClassName, useClass: ClassName }")))),(0,r.kt)("h3",{id:"factory-providers"},"Factory providers"),(0,r.kt)("p",null,"Factory providers allow us to create providers dynamically where the actual provider will be the value returned by the factory function. One benefit of this kind of provider is that it also permits using asynchronous functions. Important notice here, ",(0,r.kt)("strong",{parentName:"p"},"TokamakJS")," will wait for all the async providers to be resolved before first rendering your app."),(0,r.kt)("p",null,"For example, if in the token example above we would have needed to access the token value asynchronously:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { SubApp } from '@tokamakjs/react';\n\nimport { AUTH_TOKEN } from './constants';\nimport { fetchAuthToken } from './utils';\n\n@SubApp({\n  providers: [\n    {\n      provide: AUTH_TOKEN,\n      useFactory: async () => {\n        const token = await fetchAuthToken();\n        return token;\n      },\n    },\n  ],\n})\nexport class AppModule {}\n")),(0,r.kt)("h2",{id:"global-providers"},"Global Providers"),(0,r.kt)("p",null,"In certain scenarios, you will need a provider that it's not really directly related to any of the modules of your app. For those situations, ",(0,r.kt)("strong",{parentName:"p"},"TokamakJS")," makes possible defining global providers that you can import from anywhere in your app. To define a global provider simple add it to the ",(0,r.kt)("inlineCode",{parentName:"p"},"globalProviders")," array when creating a ",(0,r.kt)("strong",{parentName:"p"},"TokamakJS")," app:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { TokamakApp } from '@tokamakjs/react';\n\nimport { AppModule } from './app/app.module';\nimport { GlobalProvider } from './app/global.provider';\n\nasync function bootstrap() {\n  const app = await TokamakApp.create(AppModule, {\n    globalProviders: [GlobalProvider]\n  });\n\n  app.render('#root');\n}\n\nbootstrap();\n")),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"You can use any type of provider as a global provider. This means regular providers defined using decorators such as ",(0,r.kt)("inlineCode",{parentName:"p"},"@Injectable()")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"@HookService()")," or custom providers like the ones described in the previous section."))))}c.isMDXComponent=!0}}]);