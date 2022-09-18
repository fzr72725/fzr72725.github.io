---
layout: post
title: Simple Guide on How to Connect to Jupyter Notebook Server on AWS EC2 from Your Local Machine
premalink: /articles/gensim-pipeline/
---

<p align="center">
<img src="/images/jupyter_on_aws.jpg">
</p>

**TL;DR:** _In this article I described the steps to set up and connect to Jupyter Notebook running on AWS EC2 instance from a local machine. I hope that by sharing these steps, I can help others save some hours so that they can focus on their actual projects!_

Lately I realized that my capstone project needs a much more powerful machine for the computation after all.. Therefore I turned to Amazon's AWS EC2 instance. Since I'm doing a lot of EDA on my data, Jupyter Notebook has been my primary coding tool (although it is true that Jupyter Notebook can be quite annoying when you try to reproduce some data analysis that was run a while ago) for this particular project.

### 1. Connect to your EC2 instance:
After I initialized my AWS EC2 instance, I used `ssh` to connect the remote machine (EC2 instance) from my local machine:
```
ssh -i <directory for ec2 pem file>/<filename>.pem <ec2-user>@ec2-xx-xxx-xxx-xxx.compute-x.amazonaws.com
```
Note on the `ec2-user` : Each AMI publisher on EC2 decides what user (or users) should have ssh access enabled by default and what ssh credentials should allow you to gain access as that user. If you are not sure which ssh username to use, try 'root' and it will tell you what user you should login as:
```
ssh -i <directory for ec2 pem file>/<filename>.pem root@ec2-xx-xxx-xxx-xxx.compute-x.amazonaws.com

Please login as the user "ubuntu" rather than the user "root".
```
### 2. Launch Jupyter Notebook on EC2 instance:
Once I'm connected to my EC2 instance, I can launch Jupyter Notebook server from the terminal (if your instance doesn't have jupyter notebook, simply install it the same way you install it on your local machine):
```
jupyter notebook --no-browser --port=8889
```
This could take a bit long if you just launched your EC2 instance.

### 3. Connect to the remote Jupyter Notebook server:
Now I open a new terminal tab on my local machine, and `ssh` to the remote Jupyter Notebook server:
```
ssh -i <directory for ec2 pem file>/<filename>.pem
 -L 8000:localhost:8889 <ec2-user>@ec2-xx-xxx-xxx-xxx.compute-x.amazonaws.com
```
Here `-L` specifies that the given port (8000 in the example command above) on my local machine is to be forwarded to the given host and port on the remote (EC2 instance) side (8889 in the example command above, here the port 8889 is set to be consistent to the port that Jupyter Notebook was launched in _step 2_). Optionally you can change port 8000 to one of your choosing (like if 8000 is used by another process).

Once the connection is built, keep this terminal tab open and connected, otherwise the local Jupyter Notebook client launched in the next step will lose connection.

### 4. Launch Jupyter Notebook in local browser:
Now that the `ssh` channel is connected, I can access the remote Jupyer Notebook server from my local browser. Open a browser window, put the following url in:
```
http://localhost:8000/tree/
```
Here 8000 is the local port I chose in _step 3_.

You may see a page pops out with text box asking for a password or token, like below:
![Image1](/images/ask_token.png)

In this case, just go to the terminal tab with the the remote Jupyter Notebook server you launched in _step 2_, and copy the token and paste it in the text box.

### 5. Now you have Jupyter Notebook client running on your local machine that is powered by an AWS EC2 instance!
![Image2](/images/connected_jupy.png)
_You should see something like this_
