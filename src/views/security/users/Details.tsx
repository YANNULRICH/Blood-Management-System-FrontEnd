import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";

import { globalT } from "../../../lang";
import csuClient from "../../../network";
import Page from "../../../layout/Page/Page";
import Avatar from "../../../components/Avatar";
import Icon from "../../../components/icon/Icon";
import Permissions from "../../../commons/permissions";
import { SECURITY } from "../../../commons/urls/front";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/bootstrap/Button";
import { avatars } from "../../../commons/data/avatarData";
import IntlMessages from "../../../components/IntlMessages";
import { useAppDispatch } from "../../../store/redux.types";
import { FetchResource } from "../../../network/network.types";
import UserListItem from "../../../commons/models/UserListItem";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import { AbilityContext } from "../../../commons/permissions/Can";
import DeleteConfirmBox from "../../../components/dialogs/DeleteConfirmBox";
import ErrorRequestComponent from "../../../components/errors/ErrorRequestComponent";
import ContentSkeletonLoader from "../../../components/loaders/ContentSkeletonLoader";
import NotificationManager from "../../../components/notifications/NotificationManager";
import { setRequestGlobalLoader } from "../../../store/slices/requestGlobalLoader/actions";
import Card, {
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from "../../../components/bootstrap/Card";
import {
  formatDate,
  formatOptionalText,
  joinUrlWithParamsId,
} from "../../../commons/helpers/funcHelper";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from "../../../layout/SubHeader/SubHeader";

const List = () => {
  const userId = useParams().id;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);

  const [boxManagement, setBoxManagement] = useState<{
    show: boolean;
    mode: "delete";
    data: UserListItem | null;
  }>({ mode: "delete", show: false, data: null });

  const [resource, setResource] = useState<FetchResource<UserListItem>>({
    loading: true,
    content: null,
    error: null,
  });

  const loadResource = () => {
    if (!userId) return;

    setResource({
      ...resource,
      loading: true,
    });

    csuClient.security.users
      .getOne(userId)
      .then((res) => {
        const data = res.data.results;
        console.log("users", data);

        setResource({
          loading: false,
          content: data,
          error: null,
        });
      })
      .catch((error) => {
        setResource({
          loading: false,
          content: null,
          error,
        });
      });
  };

  const loadData = () => {
    loadResource();
  };

  const onRedirectToList = () => {
    navigate(SECURITY.USERS.INDEX);
  };

  useEffect(() => {
    if (!userId) {
      onRedirectToList();
      return;
    }

    loadData();
  }, [userId]);

  const handleDelete = () => {
    dispatch(setRequestGlobalLoader(true));

    csuClient.security.roles
      .delete(boxManagement.data?.id as string)
      .then(() => {
        NotificationManager.success(
          globalT("security.users.management.delete.success")
        );
        navigate(SECURITY.USERS.INDEX);
      })
      .catch(() => null)
      .finally(() => dispatch(setRequestGlobalLoader(false)));
  };

  const { loading, content, error } = resource;


  return (
    <PageWrapper
      metadata={
        content ? { title: content.email, skipTitleIntl: true } : undefined
      }
    >
      {content && (
        <SubHeader>
          <SubHeaderLeft>
            <Button
              tag="a"
              isLink
              color="primary"
              icon="ArrowBack"
              to={SECURITY.USERS.INDEX}
            >
              <IntlMessages id="button.back.to.list" />
            </Button>
            <SubheaderSeparator />
            <div>
              <span className="text-muted fst-italic me-2">
                <IntlMessages id="date.creation" />:
              </span>
              <span className="fw-bold">
                {formatDate(content.createdAt, "ll")}
              </span>
            </div>
          </SubHeaderLeft>
          <SubHeaderRight>
            {ability.can(Permissions.security.users.change, Permissions) && (
              <Button
                tag="a"
                size="sm"
                icon="Edit"
                color="success"
                className="text-nowrap bg-gradient"
                to={joinUrlWithParamsId(SECURITY.USERS.UPDATE, content.id)}
              >
                <IntlMessages id="button.update" />
              </Button>
            )}

            {ability.can(Permissions.security.users.delete, Permissions) && (
              <Button
                size="sm"
                color="danger"
                icon="Delete"
                isOutline
                isLight
                className="text-nowrap bg-gradient ms-2"
                onClick={() =>
                  setBoxManagement({
                    show: true,
                    mode: "delete",
                    data: content,
                  })
                }
              >
                <IntlMessages id="button.delete" />
              </Button>
            )}
          </SubHeaderRight>
        </SubHeader>
      )}

      <Page>
        {loading ? (
          <ContentSkeletonLoader />
        ) : !content || error ? (
          <ErrorRequestComponent error={error} loadData={loadData} />
        ) : (
          <div className="px-sm-3">
            <div className="pt-3 pb-5 d-flex align-items-center">
              <span className="display-4 fw-bold me-3">{content.email}</span>
              <span
                className={classNames(
                  `border border-${
                    content.getActiveMap().color
                  } border-2 text-${
                    content.getActiveMap().color
                  } fw-bold px-3 py-2 rounded`
                )}
              >
                <IntlMessages id={content.getActiveMap().transKey} />
              </span>
            </div>
            <div className="row">
              <div className="col-12 col-lg-4">
                <Card className="shadow-3d-primary">
                  <CardBody>
                    <div className="row g-5 py-3">
                      <div className="col-12 d-flex justify-content-center">
                        <div>
                          <div className="center-ver">
                            <Avatar
                              src={avatars.guy1.srcBlur}
                              srcSet={avatars.guy1.srcSetBlur}
                              size={100}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              <div className="col-12 col-lg-8">
                <Card>
                  <CardHeader className="pb-md-0">
                    <CardLabel icon="PersonPin" iconColor="info">
                      <CardTitle>
                        <IntlMessages id="security.roles" />
                      </CardTitle>
                    </CardLabel>
                  </CardHeader>
                  <CardBody>
                    <div className="row">
                      {content.roles.length === 0 ? (
                        <div className="col-12">
                          <h6>
                            <IntlMessages id="security.users.management.single.roles.empty" />
                          </h6>
                        </div>
                      ) : (
                        content.roles.map((role, index, arr) => {
                          return (
                            <div
                              className={classNames(
                                "col-12",
                                arr.length > 1 && "col-md-6"
                              )}
                              key={role.id}
                            >
                              {arr.length > 1 && (
                                <p className="lead fw-bold">
                                  <IntlMessages
                                    id="security.role.n"
                                    values={{ n: index + 1 }}
                                  />
                                </p>
                              )}
                              <p>
                                <strong>
                                  <IntlMessages id="form.field.name" />:{" "}
                                </strong>
                                {formatOptionalText(role.name)}
                              </p>
                              <p>
                                <strong>
                                  <IntlMessages id="security.permissions.count" />
                                  :{" "}
                                </strong>
                                {role.permissions.length}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>

            <DeleteConfirmBox
              launcher={boxManagement.mode === "delete" && boxManagement.show}
              message={globalT("security.users.management.delete.title")}
              onConfirm={() => handleDelete()}
              onCancel={() =>
                setBoxManagement({ mode: "delete", show: false, data: null })
              }
            />
          </div>
        )}
      </Page>
    </PageWrapper>
  );
};

export default List;
