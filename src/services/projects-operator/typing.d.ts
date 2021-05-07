declare namespace ProjectApi {
  type singleRuntime = {
    create_date_time: '';
    update_date_time: '';
    s_project_description: '';
    login_name: '';
    s_project_name: '';
    status: '';
    mark: '';
    badge_color: '';
  };
  type runtimeResult = {
    running: singleRuntime[];
    creating: singleRuntime[];
    exited: singleRuntime[];
    deleted: singleRuntime[];
  };
}
