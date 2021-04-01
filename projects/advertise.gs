//Calling net_use on a target creates a log
//this abuses that an advertises the victims IP in random servers


mx = include_lib("/lib/metaxploit.so")

getIP = function()
    
    r = range(1,255)
    r.shuffle
    ip = r.pull+"."+r.pull+"."+r.pull+"."+r.pull

    if is_valid_ip(ip) then
        router = get_router(ip)

        if not router == null then

            return ip
        else

            getIP
        end if
    else

        getIP
    end if

end function

advertise = function()

    ip = getIP
    got = get_router(ip)

    if got == null then

        advertise

    end if

    if not ip.indexOf("192.168") == null then
        advertise
    end if //Dont want any local IPs

    ports = got.used_ports

    for port in ports

        lip = port.get_lan_ip
        service = got.port_info(port)

        print(lip+" : "+service+" : "+port.port_number)

        if port.is_closed == false then

            mx.net_use(ip,port.port_number)
            print("<color=green>Advertised!</color> <color=orange>["+ip+"]</color>")

        end if

    end for

    advertise
end function

advertise