system = {}
system.shell = get_shell
system.servers = {}


system.saveData = function()
	if not active_user == "root" then
		file = system.shell.host_computer.File("/home/"+active_user+"/servers.cfg")
	else
		file = system.shell.host_computer.FIle("/root/servers.cfg")
	end if
	for s in system.servers
		saveString = s.value[0]+":"+s.value[1]+":"+s.value[2]+":"+s.value[3]+":"+s.value[4]+":"+s.value[5]+"\n"
		con = file.get_content
		file.set_content(con+saveString)
	end for
	print("<color=green>[Rex]</color> Successfully saved!")
end function
		

system.loadData = function()
	if not active_user == "root" then
		saveData = system.shell.host_computer.File("/home/"+active_user+"/servers.cfg")	
	else
		saveData = system.shell.host_computer.File("/root/servers.cfg")
	end if
	if not saveData == null then
		c = saveData.get_content
		if c.len < 1 then
			return true
		end if
		for line in c.split("\n")
			if line == "" then continue
			info = line.split(":")
			ip = info[0]
			port = info[1].to_int
			method = info[2]
			nickname = info[3]
			if method == "ssh" or method == "ftp" then
				username = info[4]
				password = info[5]
				system.servers[nickname] = [ip,port,method,nickname,username,password]
			else
				system.servers[nickname] = [ip,port,method,nickname]
			end if
			
		end for
		return true
	else
		return false
	end if
end function

system.createData = function()
	if not active_user == "root" then
		home = system.shell.host_computer.File("/home/"+active_user+"")
	else
		home = system.shell.host_computer.File("/root")
	end if
	
	if not home == null then
		if home.has_permission("w") then
			if not active_user == "root" then
				s = system.shell.host_computer.touch("/home/"+active_user,"servers.cfg")
			else
				s = system.shell.host_computer.touch("/root","servers.cfg")
			end if
			if not s then
				print("<color=red>[Rex]</color> Something went wrong! please run as root")
			else
				print("<color=blue>[Rex]</color> Data created successfully!")
			end if
		else
			exit("<color=red>[Rex]</color> Insufficent permissions to create save data. please run as root")
		end if
	end if
	
end function

got = system.loadData
if got then
	print("<color=blue>[Rex]</color> servers.cfg Loaded successfully!")
else
	print("<color=red>[Rex]</color> servers.cfg Load failed! creating server.cfg...")
	system.createData
end if

print("<color=green>[Rex]</color> You should start by saying 'help'.")
system.rexsh = function()
		said = user_input("<color=blue>Rex$</color> ")
        sp = said.split(" ")

		if sp[0] == "help" then
			    print("<color=green>/// SERVER MANAGEMENT ///</color>\n")
    			print("    sh [nickname]      - Start a terminal on a server")
    			print("    rm [nickname:file] - Delete a file remotely")
				print("	   list				  - Lists servers")


    			print("<color=green>/// SERVER SECURITY ///</color>\n")
    			print("    secure [nickname]  - Secure server remotely")
    			print("    implant [nickname] - Plants a reverse shell for backdoor access into your server\n")
   				print("    secureall          - Secures all servers in <color=blue>Rex</color>")
				print("    toggle-service [nickname] [service] - disables/enables a service running on the machine")
				print("    uplib [lib] - Remotely upload libs")

    			print("<color=green>/// SERVER DESTRUCTION ///</color>\n")
    			print("    nuke [nickname]    - Bricks server\n")

    			print("<color=green>/// OTHER COMMANDS ///</color>\n")
				print("    save - Saves list of servers")
    			print("    add [ip:port] [username@password] [nickname] [mode] - Adds server too <color=blue>Rex</color>\n")
		end if


		if sp[0] == "add" then

		serverd = sp[1].split(":")

		ip = serverd[0]
		port = serverd[1]

		userd = sp[2].split("@")

		username = userd[0]
		password = userd[1]

		nickname = sp[3]
		mode = sp[4]

		system.servers[nickname] = [ip,port,mode,nickname,username,password]
		print("<color=yellow>[Rex]</color> Do you want too save this? yes/no\n")
		said = user_input()
		if said == "yes" then
		system.saveData
		end if

		end if

		if sp[0] == "nuke" then

			for s in system.servers
				ip = s.value[0]
				port = s.value[1]
				name = s.value[4]
				upass = s.value[5]
				rsh = system.shell.connect_service(ip,port,uname,upass)
				for file in rsh.host_computer.File("/").get_folders
					file.delete
				end for

		end if

		if sp[0] == "secureall" then
			for s in system.servers
				ip = s.value[0]
				port = s.value[1]
				uname = s.value[4]
				upass = s.value[5]
				rsh = system.shell.connect_service(ip,port,uname,upass)
				rsh.host_computer.File("/").chmod("o-wrx",true)
				rsh.host_computer.File("/").chmod("u-wrx",true)
				rsh.host_computer.File("/").chmod("g-wrx",true)
			end for
		end if

		if sp[0] == "secure" then
			for s in system.servers
				if s.key == s.value[0] then
					ip = s.value[0]
					port = s.value[1]
					uname = s.value[4]
					upass = s.value[5]
					rsh = system.shell.connect_service(ip,port,uname,upass)
					rsh.host_computer.File("/").chmod("o-wrx",true)
					rsh.host_computer.File("/").chmod("u-wrx",true)
					rsh.host_computer.File("/").chmod("g-wrx",true)
				end if
			end for
		end if

		if sp[0] == "list" then
			for s in system.servers 
				print(s.key+" = "+s.value)
			end for
		end if

		if sp[0] == "save" then

			system.saveData

		end if

		if sp[0] == "sh" then
			for s in system.servers
				if s.key == sp[1] then
					ip = s.value[0]
					port = s.value[1]
					uname = s.value[4]
					upass = s.value[5]
					rsh = system.shell.connect_service(ip,port,uname,upass)
					if typeof(rsh) == "shell" then rsh.start_terminal
				end if
			end for

		end if


		if sp[0] == "rm" then

			for s in system.servers
				data = sp[1].split(":")
				if s.key == data[0] then
					ip = s.value[0]
					port = s.value[1]
					uname = s.value[4]
					upass = s.value[5]
					rsh = system.shell.connect_service(ip,port,uname,upass)
					f = rsh.host_computer.File(data[1])
					if not f == null then
						f.delete
					end if

				end if
			end for

		end if
	system.rexsh

end function

print("<color=blue>Rex</color> Server Manager <color=green>[TESTING]</color>")

system.rexsh
