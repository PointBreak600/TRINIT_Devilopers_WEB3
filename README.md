## Drive link

[https://drive.google.com/drive/folders/16QELSpY1pmXMAEhJXGRYNsW_TlvSsQDO?usp=sharing](https://drive.google.com/drive/folders/16QELSpY1pmXMAEhJXGRYNsW_TlvSsQDO?usp=sharing)

# Overview
To run the solution, we will first need to clone our repository. Once the repository was cloned, we should have two folders in your directory and a readme file: 
1)	**chaincode-healthcare:** It contains the chaincode project.
2)	**fabric-network:** It contains the console application project, along with detailed instructions on how to setup the environment and the network.
3)	**README:** It contains a step-by-step example to run the solution. 

To setup the Healthcare network, deploy the chaincode and use the chaincode methods we will use a bash terminal to execute a main script called bc-network stored within the fabric-network folder. 

Below, there is a step-by-step example of how to run the Healthcare network and how to use it in both the Managing and Sharing EMR workflows.
<br/>
<br/>

# Using the Healthcare Blockchain Network

To setup the Healthcare network, deploy the chaincode and use the chaincode methods we will use a bash terminal to execute a main script called bc-network stored within the fabric-network folder. 

## Prerequisites

We need to install all prereqs required (git, cURL, Docker, Docker-Compose) and bootstrap.

```bash
cd chaincode-healthcare/
npm run-script install-prereqs
npm run-script install-bootstrap
```

## Running Healthcare Network

### Creating Network
Execute the following console command:
```bash
cd fabric-network/
./bc-network.sh network create --org medicalprovider1 --admin-user mp1 --admin-pwd pass123
```

Where **medicalprovider1** is the first organization, and the other arguments are the values to create an admin user for same organization.

As output, we should have:
1)  The following docker containers running:
  * ca_orderer
  * ca_medicalprovider1
  * orderer
  * peer0.medicalprovider1
  * couchdbmedicalprovider1peer0
  * cli
2)  The medicalprovider1 admin user and its certificates.

### Creating Channel
Execute the following console command:
```bash
./bc-network.sh channel create --channel-name channel1 --org-creator medicalprovider1
```

Where **channel1** is the name of the channel and **medicalprovider1** is the organization that proposes it.

As output, we should have the channel created.

### Adding a second Organization
Execute the following console command:
```bash
./bc-network.sh network add-org --org medicalprovider2 --admin-user mp2 --admin-pwd pass123 --channel-name channel1
```

Where **medicalprovider2** is the second organization, **channel1** is the channel to join, and the other arguments are the values to create an admin user for same organization.

As output, we should have:
1)	The following docker containers running:
  * ca_medicalprovider2
  * peer0.medicalprovider2
  * couchdbmedicalprovider2peer0
2)	The medicalprovider2 admin user and its certificates.
3)	The channel1 channel ready to receive both organizations.

### Joining Organization to Channel
Execute the following console command:
```bash
./bc-network.sh channel join --channel-name channel1 --org medicalprovider1 --org medicalprovider2
```

Where **channel1** is the name of the channel and **medicalprovider1** and **medicalprovider2** are the organizations that will join it.

As output, we should have both organizations joined to **channel1** channel (we can test this using the command “peer channel list” in the peer container’s cli).

### Creating Organization's Users
Execute the following console commands in a row: 
```bash
./bc-network.sh user create --user-name py1 --user-pwd pass123 --user-role physician --org medicalprovider1  
```
```bash
./bc-network.sh user create --user-name hc1 --user-pwd pass123 --user-role healthcenter --org medicalprovider1  
```
```bash
./bc-network.sh user create --user-name pa1 --user-pwd pass123 --user-role patient --org medicalprovider1  
```

Where the **user’s arguments** (name, password, and role) are the values to register the new user and **medicalprovider1** is the organization that it will belong to. Then execute the same commands but using **medicalprovider2** as the organization.

As output, we should have three new users for each organization, each one with a different role.

### Deploying Chaincode
Execute the following console command:
```bash
./bc-network.sh chaincode deploy-org --cc-name healthcare --cc-path ../chaincode-healthcare --cc-version 1.1 --cc-sequence 1 --channel-name channel1 --org medicalprovider1 --org medicalprovider2
```

Where **healthcare** is the chaincode name and **medicalprovider1** and **medicalprovider2** are the organizations where it will be deploying using the channel1 channel.

As output, we should have the Healthcare chaincode installed in both organizations.

## Invoking Chaincode Methods
To use the Healthcare network to manage the blockchain we must invoke the chaincode methods using the console commands as follows:
```bash
./bc-network.sh chaincode invoke --cc-name healthcare --cc-args FCN_CALL --user-name USER --org ORG --channel-name channel1 
```

Where **healthcare** is the chaincode name and **USER** is the invoking user that belongs to the **ORG** organization on channel1 channel. Finally, we have the **FCN_CALL** argument which is a string composed by the method to be invoked and its required parameters. From now on, we will call this console command as *invoke command*.

### EMR Managing

#### Create EMR
Execute the *invoke command* with the following values:
user-name: hc1
org: medicalprovider1
FCN_CALL:
```bash
'{"Args":["HealthCenter:CreateEmr","{\"patientId\":\"pa1\",\"patientName\":\"patient01\",\"patientBirthdate\":\"10-03\"}"]}'
```
The console command for this will be:
```bash
./bc-network.sh chaincode invoke --cc-name healthcare --cc-args '{"Args":["HealthCenter:CreateEmr","{\"patientId\":\"pa1\",\"patientName\":\"patient01\",\"patientBirthdate\":\"10-03\"}"]}' --user-name hc1 --org medicalprovider1 --channel-name channel1 
```

Response: created EMR.

#### Read EMR
Execute the *invoke command* with the following values:
user-name: py1
org: medicalprovider1
FCN_CALL:
```bash
'{"Args":["Physician:ReadEmr","EMR_ID"]}'
```
The console command for this will be:
```bash
./bc-network.sh chaincode invoke --cc-name healthcare --cc-args '{"Args":["Physician:ReadEmr","EMR_ID"]}' --user-name py1 --org medicalprovider1 --channel-name channel1
```
Replace <code>EMR_ID</code> with the actual EMR_ID received from the previous payload.

Response: EMR with EMR_ID as Id.

#### Add note EMR
Execute the *invoke command* with the following values:
user-name: py1
org: medicalprovider1
FCN_CALL:
```bash
'{"Args":["Physician:AddEmrNote","{\"patientId\":\"pa1\",\"area\":\"Traumatology\",\"vitalSigns\":\"Poor\",\"diagnosis\":\"Fracture\",\"medication\":\"Painkillers\"}"]}'
```
The console command for this will be:
```bash
./bc-network.sh chaincode invoke --cc-name healthcare --cc-args '{"Args":["Physician:AddEmrNote","{\"patientId\":\"pa1\",\"area\":\"Traumatology\",\"vitalSigns\":\"Poor\",\"diagnosis\":\"Fracture\",\"medication\":\"Painkillers\"}"]}' --user-name py1 --org medicalprovider1 --channel-name channel1
```

Response: Note added to pa1’s EMR.

#### Download EMR
Execute the *invoke command* with the following values:
user-name: pa1
org: medicalprovider1
FCN_CALL:
```bash
'{"Args":["Patient:GetOwnEmr"]}'
```
The console command for this will be:
```bash
./bc-network.sh chaincode invoke --cc-name healthcare --cc-args '{"Args":["Patient:GetOwnEmr"]}' --user-name pa1 --org medicalprovider1 --channel-name channel1
```

Response: pa1’s EMR updated.

### EMR Sharing

#### Autorize EMR Sharing
Execute the *invoke command* with the following values:
user-name: hc1
org: medicalprovider1
FCN_CALL:
```bash
'{"Args":["HealthCenter:AuthorizeEmrReading","medicalprovider2","{EMR_ID}"]}'
```
The console command for this will be:
```bash
./bc-network.sh chaincode invoke --cc-name healthcare --cc-args '{"Args":["HealthCenter:AuthorizeEmrReading","medicalprovider2","{EMR_ID}"]}' --user-name hc1 --org medicalprovider1 --channel-name channel1
```

Response: EMR permission.

#### Approve EMR Sharing
Execute the *invoke command* with the following values:
user-name:pa1
org: medicalprovider1
FCN_CALL:
```bash
'{"Args":["Patient:ApproveEmrSharing","medicalprovider2"]}'
```
The console command for this will be:
```bash
./bc-network.sh chaincode invoke --cc-name healthcare --cc-args '{"Args":["Patient:ApproveEmrSharing","medicalprovider2"]}' --user-name pa1 --org medicalprovider1 --channel-name channel1
```

Response: EMR permission ready to share.

#### Get shared EMR
Execute the *invoke command* with the following values:
user-name: py2
org: medicalprovider2
FCN_CALL:
```bash
'{"Args":["Physician:GetSharedEmr","medicalprovider1","pa1"]}'
```
The console command for this will be:
```bash
./bc-network.sh chaincode invoke --cc-name healthcare --cc-args '{"Args":["Physician:GetSharedEmr","medicalprovider1","pa1"]}' --user-name py2 --org medicalprovider2 --channel-name channel1
```

Response: EMR shared from medicalprovider1. 
