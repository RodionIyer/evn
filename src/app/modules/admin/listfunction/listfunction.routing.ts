import { ActivatedRouteSnapshot, Route, UrlMatchResult, UrlSegment } from '@angular/router';
import { isEqual } from 'lodash';
import { ListFunctionDetailsComponent } from './detail/details.component';
import { ListFunctionEmptyDetailsComponent } from './empty-details/empty-details.component';
import { ListFunctionListComponent } from './list/list.component';
import { ListFunctionComponent } from './listfunction.component';
import { ListFunctionDetailResolver, ListFunctionListResolver } from './listfunction.resolvers';


export const ListFunctionRunGuardsAndResolvers: (from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot) => boolean = (from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot) => {

  // If we are navigating from mail to mails, meaning there is an id in
  // from's deepest first child and there isn't one in the to's, we will
  // trigger the resolver

  // Get the current activated route of the 'from'
  let fromCurrentRoute = from;
  while (fromCurrentRoute.firstChild) {
    fromCurrentRoute = fromCurrentRoute.firstChild;
  }

  // Get the current activated route of the 'to'
  let toCurrentRoute = to;
  while (toCurrentRoute.firstChild) {
    toCurrentRoute = toCurrentRoute.firstChild;
  }

  // Trigger the resolver if the condition met
  if (fromCurrentRoute.paramMap.get('id') && !toCurrentRoute.paramMap.get('id')) {
    return true;
  }

  // If the from and to params are equal, don't trigger the resolver
  const fromParams = {};
  const toParams = {};

  from.paramMap.keys.forEach((key) => {
    fromParams[key] = from.paramMap.get(key);
  });

  to.paramMap.keys.forEach((key) => {
    toParams[key] = to.paramMap.get(key);
  });

  if (isEqual(fromParams, toParams)) {
    return false;
  }

  // Trigger the resolver on other cases
  return true;
};
export const ListFunctionRouteMatcher: (url: UrlSegment[]) => UrlMatchResult = (url: UrlSegment[]) => {

  // Prepare consumed url and positional parameters
  let consumed = url;
  const posParams = {};
  if (url[0]) {
    consumed = url.slice(0, -1);
  }
  return {
    consumed,
    posParams
  };
};
export const ListFunctionRoutes: Route[] = [
  {
    path: '',
    component: ListFunctionComponent,
    children: [
      {
        component: ListFunctionListComponent,
        matcher: ListFunctionRouteMatcher,
        runGuardsAndResolvers: ListFunctionRunGuardsAndResolvers,
        resolve: {
          apis: ListFunctionListResolver
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: ListFunctionEmptyDetailsComponent
          },
          {
            path: ':id',
            runGuardsAndResolvers: 'always',
            component: ListFunctionDetailsComponent,
            resolve: {
              apiDetail: ListFunctionDetailResolver
            }
          }
        ]
      }
    ]
  }
];
