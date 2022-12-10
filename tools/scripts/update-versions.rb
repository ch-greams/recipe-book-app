#!/usr/bin/env ruby


$node_projects = [
    "services/web-app",
    "services/docs-app",    
    "tools/recipe-scraper",
]

$rust_projects = [
    "services/web-api",
    "services/auth-api",
    "tools/rba-cli",
]

def print_result(is_success, project_path, version)
    puts is_success ? "\t✅ Done" : "\t❌ Wasn't able to update #{project_path} to #{version}"
end

def update_projects(version)

    is_setup_success = system("cargo install cargo-edit")

    unless is_setup_success
        return "\n❌ Error during setup"
    end

    for node_project_path in $node_projects do
        puts "\n🔄 Updating version for #{node_project_path}..."

        Dir.chdir(node_project_path) do
            is_success = system("npm version #{version}")
            print_result(is_success, node_project_path, version)
        end
    end

    for rust_project_path in $rust_projects do
        puts "\n🔄 Updating version for #{rust_project_path}..."

        Dir.chdir(rust_project_path) do
            is_success = system("cargo set-version #{version}")
            print_result(is_success, node_project_path, version)
        end
    end

    return "\n✅ Finished updating project versions"
end

if __FILE__ == $0

    # TODO: Add github stuff like PR merge and release/tag
    version = ARGV[0]

    unless version.nil?
        puts update_projects(version)
    else
        puts "\n⛔ No new version is specified"
    end
end
