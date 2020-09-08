mx = include_lib("/lib/metaxploit.so")

if not mx then
	mx = include_lib(get_shell.host_computer.current_path+"/metaxploit.so")
	
	if not mx then
		exit("Please place metaxploit.so inside /lib or this directory")
	end if

end if

print("<color=green>Trying stuff...</color>")

computer = get_shell.host_computer
libs = computer.File("/lib")

if libs == null then
	exit("They're no libs too escalate from on this computer.")
end if


exhandler = function(addr,str,libname)

	lib = mx.load("/lib/"+libname)
	res = lib.overflow(addr,str,"potato")
	
	type = typeof(res)
	
	if type == "shell" then
		res.start_terminal
	end if
	
	
	print(res)

end function


for lib in libs.get_files
	
	ml = mx.load("/lib/"+lib.name)
	
	if not ml == null and lib.name == "kernel_module.so" or lib.name == "net.so" or lib.name == "init.so" then
		
		
		addrs = mx.scan(ml)
		for addr in addrs
			
			info = mx.scan_address(ml,addr)
			
			
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
				n = lib.name
				exhandler(addr,str,n)
			end while
			
		end for
				
		
		
	end if

end for



