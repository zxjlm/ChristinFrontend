declare namespace API {
  type basicData = {
    "user_c": number,
    "herb_c": number,
    "pre_c": number,
    "gene_c": number,
    "pro_c": number,
    "other_c": number,
    "total_c": number,
  }

  type projectInfo = {
    badge_color: string,
    create_date_time: string,
    login_name: string,
    mark: string,
    s_project_description: string,
    s_project_name: string,
    status: string,
    suffix: string,
    suffix_color: string,
    update_date_time: string,
  }

  type projectRuntimeData = {
    'creating': projectInfo[]
    'running': projectInfo[],
    'exited': projectInfo[],
    'deleted': projectInfo[],
  }
}
