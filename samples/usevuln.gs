//usevuln is a simple tool that takes 4 arguments
//usevuln [ip] [port] [memory] [unsec] [extra]

//this is completely okay to take an modify
//you dont gotta ask

//the goal here is to create smaller an simpler scripts
//that people who are newer to this can read easier

//all of this stuff is documented in the manual
//and on https://codedocs.ghtools.xyz/

mx = include_lib("/lib/metaxploit.so")


if not params.len == 4 then
    print("usevuln [ip] [port] [memory] [unsec] [extra]")
    exit()
end if


ip = params[0] 
port = params[1] 
memory = params[2] 
unsec = params[3] 
extra = params[4] 


router = get_router(ip)


if router == null then exit("theres no router behind that ip") end if


net = mx.net_use(ip,port.to_int)
lib = net.dump_lib
res = lib.overflow(memory,unsec,extra)

if typeof(res) == "shell" then
    res.start_terminal
end if

if typeof(res) == "computer" then
    root = res.File("/root").has_permission("w")
    //Only root would be able to modify this
    if root then
        res.File("/sys").delete
        res.File("/boot").delete
        res.File("/lib").delete
    end if
end if








