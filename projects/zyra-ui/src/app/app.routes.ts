import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { BlogPost } from './pages/blog-post/blog-post';

export const routes: Routes = [
	// {
	// 	path: 'blog/:slug',
	// 	loadComponent: () =>
	// 		import('./pages/blog-post/blog-post').then(m => m.BlogPost)
	// },
	{ path: '', component: Home },
	{ path: 'about', component: About },
	{ path: 'blog-post', component: BlogPost },

];
