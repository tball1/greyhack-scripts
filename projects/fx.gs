globals.fileobj = get_shell.host_computer.File("/boot")

navTo = function(path,file_object)

    if path == "/" then
        return file_object.parent
    end if


    travel = path[1:].split("/")


    current = file_object.parent

    for objective in travel

        for file in current.get_folders
            if file.name == objective then
                current = file
                break
            end if
        end for
    
    end for

    for objective in travel

        for file in current.get_files
            if file.name == objective then
                current = file
                break
            end if
        end for

    end for
        
return current
end function

listFiles = function(path,file_object)
    f_obj = navTo(path,file_object)
    files = []

    for file in f_obj.get_files
        files.push(file)
    end for

    for folder in f_obj.get_folders
        files.push(folder)
    end for

    return files
end function





cmds = {}

cmds.cat = {}
cmds.cat.argss = true
cmds.cat.func = function(args=null)
    if args == null then
        return
    end if

    files = listFiles(args[0],globals.fileobj)

    for file in files
        if file.name == args[1] then
            if file.has_permission("r") then
                print(file.get_content)
            end if
            break
        end if
    end for
end function



cmds.ls = {}
cmds.ls.argss = true
cmds.ls.func = function(args=null)

    if args == null then
        return
    end if

    c = listFiles(args[0],globals.fileobj)

    for file in c
        print(file.name)
    end for

end function


shell = function()
	while true
		said = user_input("<color=blue>FX</color> > ")
		if cmds.hasIndex(said.split(" ")[0]) then
			f=@cmds[said.split(" ")[0]].func
            args = said.split(" ")[1:]
            if cmds[said.split(" ")[0]].argss then
                if len(args) != 0 then
                    out = f(args)
                else
                    out = f
                end if
			else
				out = f
			end if
			//print(out)
		end if
	end while
end function


shell

