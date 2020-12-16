//zMap is a custom version of the default nmap code
//with more features as such as
//WIFI information
//Router information
//WHOIS information
//Automatic ip/domain conversion

if params.len < 1 then exit()
if not get_shell.host_computer.is_network_active then exit("zmap: can't connect. No internet access.")

ipAddress = params[0]
isLanIp = is_lan_ip( ipAddress )

if isLanIp then
	router = get_router;
else
	if is_valid_ip(ipAddress) then
		router = get_router( ipAddress )
	else
		ipAddress = nslookup(ipAddress)
		router = get_router(ipAddress)
	end if
end if

if router == null then exit("zmap: ip address not found")
ports = null

if not isLanIp then
	ports = router.used_ports
else
	ports = router.device_ports(ipAddress)
end if

if ports == null then exit("zmap: ip address not found")
if typeof(ports) == "string" then exit(ports)



info = "PORT STATE SERVICE VERSION LAN ESSID BSSID"   
print("\nStarting zmap v1.2 at " + current_date)
print("Interesting ports on " + params[0] + "\n")
if(ports.len == 0) then exit("Scan finished. No open ports.")

for port in ports
	service_info = router.port_info(port)
	lan_ips = port.get_lan_ip
	port_status = "yes"
	
	if(port.is_closed and not isLanIp) then
		port_status = "no"
	end if
	info = info + "\n" + port.port_number + " " + port_status + " " + service_info + " " + lan_ips + " " + router.essid_name + " " + router.bssid_name
end for
print(format_columns(info) + "\n")

print("OTHER INFORMATION ")
kv = router.kernel_version
print("kernel_router.so: "+kv)
print("\n")

print("WHOIS INFORMATION")
print(whois(ipAddress))
print("\n")

