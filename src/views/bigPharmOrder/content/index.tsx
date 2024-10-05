import React from "react";
import { Routes, Route } from "react-router-dom";
import { ORDER_BLOOD } from "../url/front";
import Add from "./Add";
import CanRoute from "../../../commons/permissions/CanRoute";
import Permissions from "../../../commons/permissions";
import Update from "./Update";
import List from "./List";

const Index = () => {
  return (
    <Routes>
      <Route path={ORDER_BLOOD.ROUTES_ENGINE.ADD} element={<Add />} />
      <Route path={ORDER_BLOOD.ROUTES_ENGINE.UPDATE} element={<Update />} />
      <Route path={ORDER_BLOOD.ROUTES_ENGINE.INDEX} element={<List />} />

    </Routes>
  );
};

export default Index;
