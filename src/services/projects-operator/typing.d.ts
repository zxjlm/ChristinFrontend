declare namespace ProjectApi {
  type singleRuntime = {
    create_date_time: string;
    update_date_time: string;
    s_project_description: string;
    login_name: string;
    s_project_name: string;
    status: string;
    mark: string;
    badge_color: string;
  };
  type runtimeResult = {
    running: singleRuntime[];
    creating: singleRuntime[];
    exited: singleRuntime[];
    deleted: singleRuntime[];
  };
  type projectDetailResult = {
    create_date_time: string;
    update_date_time: string;
    s_project_description: string;
    login_name: string;
    s_project_name: string;
    status: string;
    mark: string;
    badge_color: string;
    data: [];
    labels: [];
    remark: {
      port: string;
      password: string;
    };
  };
}
