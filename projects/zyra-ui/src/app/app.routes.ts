import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Docs } from './pages/docs/docs';
import { Login } from './pages/login/login';
import { About } from './pages/about/about';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((c) => Home),
  },
  {
    path: 'blog-header',
    loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./blog/blog-page/blog-page').then((m) => m.BlogPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((c) => Login),
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/docs').then((c) => Docs),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((c) => About),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
];
