mx = include_lib("/lib/metaxploit.so")

farm = function()
    part_one = floor((rnd * 255) + 1)
    part_two = floor((rnd * 255) + 1)
    part_three = floor((rnd * 255) + 1)
    part_four = floor((rnd * 255) + 1)
    ip = part_one+"."+part_two+"."+part_three+"."+part_four


    if is_valid_ip(ip) then
        print("valid")
    else
        farm
        break
    end if

    if is_lan_ip(ip) then
        print("its a lan ip :(")
        farm
        break
    end if

    r=get_router(ip)
    if r == null then
        print("invalid router")
        farm
        break
    end if

    dports = r.used_ports

    for port in dports

        if port.is_closed then
            continue
        end if

        port = port.port_number



        netsess = mx.net_use(ip,port)

        lib = netsess.dump_lib
        addrs = mx.scan(lib)

        exhandler = function(addr,unsec)
            ex = lib.overflow(addr,unsec)
            
            if typeof(ex) == "computer" then

                users = ex.File("/home").get_folders

                for user in users
                    bankFile = ex.File("/home/"+user.name+"/Config/Bank.txt")
                    if bankFile == null then
                        print(user.name+ " doesnt have a bank account txt file")
                        continue
                    end if

                    print("<color=purple>BANK ACCOUNT: </color>"+bankFile.get_content)
                    storage = get_shell.host_computer.File("/home/"+active_user+"/banks")
                    storagedata = storage.get_content
                    storage.set_content(storagedata+"\n"+bankFile.get_content)

                end for

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
                break
            end while
            
            
            
        end for
    end for
    farm
end function

farm