import React from "react";
import { Routes, Route } from "react-router-dom";
import { HOSPITAL } from "../url/front";
import Add from "./Add";
import CanRoute from "../../../commons/permissions/CanRoute";
import Permissions from "../../../commons/permissions";
import Update from "./Update";
import List from "./List";
const Index = () => {
  return (
    <Routes>
      <Route
        path={HOSPITAL.ROUTES_ENGINE.ADD}
        element={
          <CanRoute permissions={[Permissions.security.permissions.view]}>
            <Add />
          </CanRoute>
        }
      />
      <Route
        path={HOSPITAL.ROUTES_ENGINE.UPDATE}
        element={
          <CanRoute permissions={[Permissions.security.permissions.view]}>
            <Update />
          </CanRoute>
        }
      />
      <Route path="*" element={<List />} />
    </Routes>
  );
};

export default Index;
