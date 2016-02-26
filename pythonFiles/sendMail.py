

import smtplib
import mailSettings

def sendMail(to,message):
    fromaddr = mailSettings.fromAddr
    toaddrs  = to
    msg = message


    # Credentials (if needed)
    username = mailSettings.username
    password = mailSettings.password


    # The actual mail send
    server = smtplib.SMTP(mailSettings.smtpaddres,mailSettings.smtpport)
    server.ehlo()
    server.starttls()
    server.login(username,password)
    server.sendmail(fromaddr, toaddrs, msg)
    server.quit()