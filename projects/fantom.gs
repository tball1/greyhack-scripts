hc=get_shell.host_computer
mx = include_lib("/lib/metaxploit.so")
crypto = include_lib("/lib/crypto.so")


if not mx then
	mx = include_lib(hc.current_path+"/metaxploit.so")
	if not mx then
		exit("Please install metaxploit.so in /lib or in installation directory.")
	end if
end if


if not crypto then
	crypto = include_lib(hc.current_path+"/crypto.so")
	if not crypto then
		exit("Please install crypto.so in /lib or in installation directory.")
	end if
end if

print("\n<color=#3f3e40>Fantom build 0.3</color>")

system_message = function(text)
	print("<color=#3f3e40>[Fantom Notification] > </color>"+text)
end function


if active_user == "root" then
	system_message("\nRunning Fantom in a root shell is the only way too run most security commands.")
end if



hackrouter = function(ip,lan)
	
	r=get_router(ip)
	
	netsess = mx.net_use(ip)
	
	lib = netsess.dump_lib
	addrs = mx.scan(lib)
	
	exhandler = function(addr,unsec)
		ex = lib.overflow(addr,unsec,lan)
		
		if typeof(ex) == "computer" then

		pwd = ex.File("/etc/passwd")
		if pwd != null then
			print(pwd.content)
		end if

		end if

		if typeof(ex) == "shell" then
			print("Fantom has found a shell\nwould you like too use it? y/n")
			said = user_input("Answer:")

			if said == "y" then ex.start_terminal end if

		end if
		
		
		
	end function
	
	
	for addr in addrs
		
		info = mx.scan_address(lib,addr)
		info = info.remove("decompiling source...").remove("searching unsecure values...")
		info = info[2:]
		
		while info.indexOf("Unsafe check: ") != null or info.indexOf("<b>") != null or info.indexOf("</b>") != null
			info = info.remove("Unsafe check: ").remove("<b>").remove("</b>")
		end while
		
		while info.indexOf("loop in array ") != null
			info = info.replace("loop in array ", "<tag>")
		end while
		
		while info.indexOf("string copy in ") != null
			info = info.replace("string copy in ", "<tag>")
		end while
		
		while info.indexOf("<tag>") != null
			a = info.indexOf("<tag>") + 5
			info = info.remove(info[:a])
			str = info[:info.indexOf(".")]
			exhandler(addr,str)
		end while
		
		//print(info)
		
	end for
	
	
end function






hack = function(ip,port)
	
	r=get_router(ip)
	
	netsess = mx.net_use(ip,port)
	
	lib = netsess.dump_lib
	addrs = mx.scan(lib)
	
	exhandler = function(addr,unsec)
		ex = lib.overflow(addr,unsec)
		
		if typeof(ex) == "computer" then

			pwd = ex.File("/etc/passwd")
			if not pwd == null then
				if pwd.has_permission("r") then
					print(pwd.content)
				else
					print("<color=red>Fantom doesn't have permission too read /etc/passwd</color>")
				end if
			else
				print("<color=red>The password file seems too have been deleted...</color>")
			end if
			
		end if
		
		if typeof(ex) == "shell" then
			print("Fantom has found a shell\nwould you like too use it? y/n")
			said = user_input("Answer:")

			if said == "y" then ex.start_terminal end if
		end if
		
		
		
	end function
	
	
	for addr in addrs
		
		info = mx.scan_address(lib,addr)
		info = info.remove("decompiling source...").remove("searching unsecure values...")
		info = info[2:]
		
		while info.indexOf("Unsafe check: ") != null or info.indexOf("<b>") != null or info.indexOf("</b>") != null
			info = info.remove("Unsafe check: ").remove("<b>").remove("</b>")
		end while
		
		while info.indexOf("loop in array ") != null
			info = info.replace("loop in array ", "<tag>")
		end while
		
		while info.indexOf("string copy in ") != null
			info = info.replace("string copy in ", "<tag>")
		end while
		
		while info.indexOf("<tag>") != null
			a = info.indexOf("<tag>") + 5
			info = info.remove(info[:a])
			str = info[:info.indexOf(".")]
			exhandler(addr,str)
		end while
		
		//print(info)
		
	end for
	
	
end function


system_shell = function()
	
	
	message = user_input("\n<color=#3f3e40>Fantom <color=green>[SYSTEM]</color> > </color>")
	args = message.split(" ")
	
	if args[0] == "commands" then
		print("\n<color=green>			Security Commands.</color>\n")
		
		print("		secure -> Removes programs/files that introduce security issues also chmods the system.")
		print("		decipher [file] -> Fancy version of the decipher tool\n")
		print("		rshell_interface -> Fantom's rshell interface")
		print("		<i>More soon..</i>\n")
		
		
	end if

	if args[0] == "rshell_interface" then
		victims = mx.rshell_server
		l = {}
		c = 0
		for victim in victims
			ip = victim.host_computer.public_ip
			local = victim.host_computer.local_ip	
			print(c+". shell@"+ip+"-"+local)
			l[c]=victim
			c = c +1
		end for
		pick = user_input("number:")
		l[pick.to_int].start_terminal
	end if

	if args[0] == "decipher" then

	filename = args[1]
	file = get_shell.host_computer.File(filename)
	if not file == null then

	logins = file.content.split("\n")
	for login in logins
		info = login.split(":")
		accnum = info[0]
		hash = info[1]
		got = crypto.decipher(accnum,hash)
		print(accnum+" -> "+got)
	end for

	end if

	end if

	if args[0] == "secure" then
		
		if not active_user == "root" then
			print("<color=red>Fantom cannot be sure that this command worked due to no root access</color>")	
			
		end if
		
		get_shell.host_computer.File("/").chmod("o-wrx",1)
		get_shell.host_computer.File("/").chmod("u-wr",1)
		get_shell.host_computer.File("/").chmod("g-wr",1)
		
		pwd = get_shell.host_computer.File("/etc/passwd")
		if not pwd == null then
			pwd.delete()	
		end if
		
		print("<color=green>Fantom has secured this machine.")
		print("<color=red>You have too run sudo an get root before you can do anything or your machine</color>")
		
	end if
	
	
	if args[0] == "exit" then
		return
	end if
	
	
	system_shell
end function

system_message("You can also type 'shell' in order too gain access too system commands.")
menu = function()
	
	
	target = user_input("\n<color=green>Target IP/DOMAIN: </color> ")
	if target == "shell" then system_shell end if
	
	target_router = get_router(target)
	target_domain = nslookup(target)
	
	if not target_domain == "Not found" then
		print("\n<color=green>Valid domain detected, using IP instead..</color>")
		target_router = target_domain
	end if
	
	
	if target_router == null then
		
		menu
	end if
	
	if not target_domain == "Not found" then
		target_router = get_router(target_router)
	end if
	
	usedports = target_router.used_ports
	
	print("\n<color=green>			Port information</color>\n")
	
	for port in usedports
		service = target_router.port_info(port)
		
		if port.is_closed then
			print(service+" "+port.port_number+" "+port.get_lan_ip+" <color=green>[CLOSED]</color>")
		else
			print(service+" "+port.port_number+" "+port.get_lan_ip+" <color=green>[OPEN]</color>")
		end if
		
	end for
	
	print("\n<color=green>			WHOIS information</color>")
	print(whois(target_router.public_ip)+"\n")
	
	print("\n<color=green>			Other information</color>\n")
	kernel = mx.net_use(target_router.public_ip).dump_lib.version
	print("kernel_router: "+kernel+"\n")
	
	system_message("Type 'commands' too see commands.")
	system_message("Alternatively you can type 'exit' too inspect another IP.")
	
	usr_shell = function()
		message = user_input("\n<color=#3f3e40>Fantom > </color>")
		args = message.split(" ")
		
		
		if args[0] == "commands" then
			
			print("\n<color=green>			Reconnaissance Commands.</color>\n")
			print("		wifi	->	Gets wifi information.")
			print("		lans ->	Gets all devices on the network.")
			print("		router -> Gets the routers local IP.")
			print("		decipher [hash] -> Deciphers a hash")
			print("		smtp [port] -> Shows smtp information")
			print("		sniffer -> Sniffs for outbound connections")
			
			print("\n<color=green>			Hacking Commands.</color>\n")
			print("		hack [port] -> Have Fantom do the hacking for you")
			print("		routerhack [lan] -> Fantom will hack this lan address through the router")

			
			print("\n	<i>More soon..</i>")
			
		end if
		
		if args[0] == "sniffer" then
			mx.sniffer
		end if

		if args[0] == "hack" then
			port = args[1].to_int
			hack(target_router.public_ip,port)
		end if

		if args[0] == "routerhack" then
			lan = args[1]
			hackrouter(target_router.public_ip,lan)
		end if
		
		if args[0] == "smtp" then
		port = args[1].to_int
		got = crypto.smtp_user_list(target_router.public_ip,port)
		
		for mail in got
			print(mail)
		end for

		end if

		if args[0] == "wifi" then
			print("ESSID: "+target_router.essid_name)
			print("BSSID: "+target_router.bssid_name)
			crypto.airmon("start","wlan0")
			networks = get_shell.host_computer.wifi_networks("wlan0")
			if networks.indexOf(target_router.essid_name) != null and networks.indexOf(target_router.bssid_name) != null then
				print("<color=green> This WIFI is in range!</color>")
			else
				print("Not in range.")
			end if
			
			
		end if
		
		if args[0] == "router" then
			
			print(target_router.local_ip)
			
		end if
		
		if args[0] == "decipher" then
			hash = args[1]
			got = crypto.decipher("root",hash)
			print(got)
		end if
		
		if args[0] == "lans" then
			
			
			lans = target_router.devices_lan_ip
			
			for lan in lans
				if target_router.public_ip == get_router.public_ip and get_shell.host_computer.lan_ip == lan then
					print(lan+" <color=green>[YOU]</color>")
				else
					print(lan)
				end if
			end for
			
			
		end if
		
		
		if args[0] == "exit" then 
			return 
		end if
		
		usr_shell
	end function
	usr_shell
	
	menu
end function

menu
