import {createAction} from "@reduxjs/toolkit";
import * as types from '../../actionTypes';

export const setTree = createAction(types.SET_TREE, (treeNode:any[]) => ({
    payload: treeNode,
}));
