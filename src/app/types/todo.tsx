import { inferRouterOutputs } from '@trpc/server';
import { AppRouterType } from '../server/index';

type RouterOutput = inferRouterOutputs<AppRouterType>;

// Example
// export type TodosType = NonNullable<RouterOutput['todo']['getTodos']>
// export type TodoType = NonNullable<RouterOutput['todo']['getTodo']>

