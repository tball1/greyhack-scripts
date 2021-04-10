//Riot is a way of seperating code up into different "modules" then combining it into one executable

//PLANS:
//  Module src encryption
//  Automatic deletion of old imported modules in scripts




print("<color=blue>Riot</color>")

if not active_user == "root" then
    print("active user")
    print("<color=blue>Riot</color> cannot ensure everything works correctly without root")
    print("<color=red>Exiting</color>")
    exit()
end if


root_shell = get_shell

module_home = root_shell.host_computer.File("/modules")

if module_home == null then
    root_shell.host_computer.create_folder("/","modules")
    module_home = root_shell.host_computer.File("/modules")
    print("Creating /modules")
end if

target_file = user_input("Target file(include path):")

target_file_obj = root_shell.host_computer.File(target_file)


if target_file_obj == null then
    exit("<color=red>Invalid file</color>")
end if

old = target_file_obj.get_content
target_file_obj.set_content(char(10)+"// RIOT MODULES"+char(10)+old)

for module in module_home.get_files
    module_content = "if not globals.riot then exit(""Invalid module system"")"+char(10)+module.get_content
    file_content = target_file_obj.get_content

    target_file_obj.set_content(module_content+char(10)+file_content)
    print("<color=green>Added: "+module.name+"</color>")
end for

old = target_file_obj.get_content
target_file_obj.set_content(char(10)+"globals.riot = true"+char(10)+old)

root_shell.build(target_file,home_dir)
print("Executable saved in home dir")