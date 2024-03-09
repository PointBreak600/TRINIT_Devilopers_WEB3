const express = require('express')
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.get('/', (req, res) => {
    console.log(req.body);

    const command = `cd ../fabric-network && ls`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(`${stdout}`);
    })
})


app.get('/CreateNetwork', (req, res) => {

    const { orgName, adminUserName, password } = req.body;

    console.log('Received Organization:', orgName);
    console.log('Received admin user name: ', adminUserName);
    console.log('Received admin password: ', password)

    const command = `cd ../fabric-network && ./bc-network.sh network create --org ${orgName} --admin-user ${adminUserName} --admin-pwd ${password}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})


app.get('/CreateChannel', (req, res) => {

    const { channelName, orgName } = req.body;

    console.log('Received Organization:', orgName);
    console.log('Received channelName name: ', channelName);

    const command = `cd ../fabric-network && ./bc-network.sh channel create --channel-name ${channelName} --org-creator ${orgName}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/AddMoreOrganizations', (req, res) => {

    const { orgName, channelName, adminUserName, password } = req.body;

    console.log('Received Organization:', orgName);
    console.log('Received channelName: ', channelName);
    console.log('Received userName: ', adminUserName);
    console.log('Received password: ', password);

    const command = `cd ../fabric-network && ./bc-network.sh network add-org --org ${orgName} --admin-user ${adminUserName} --admin-pwd ${password} --channel-name ${channelName}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/JoinOrganizationToChannel', (req, res) => {

    const { channelName, orgName1, orgName2 } = req.body;

    console.log('Received Organization 1:', orgName1);
    console.log('Received Organization 2:', orgName2);
    console.log('Received channelName name: ', channelName);

    const command = `cd ../fabric-network && ./bc-network.sh channel join --channel-name ${channelName} --org ${orgName1} --org ${orgName2}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/CreateUsers', (req, res) => {

    const { userName, userPassword, userRole, orgName } = req.body;

    console.log('Received user name:', userName);
    console.log('Received user Password:', userPassword);
    console.log('Received user Role: ', userRole);
    console.log('Received Organization', orgName);

    const command = `cd ../fabric-network && ./bc-network.sh user create --user-name ${userName} --user-pwd ${userPassword} --user-role ${userRole} --org ${orgName}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/DeployChainCode', (req, res) => {

    const { chainCodeName, orgName1, orgName2, channelName } = req.body;

    console.log('Received Organization 1', orgName1);
    console.log('Received Organization 2', orgName2);
    console.log('Received chainCodeName ', chainCodeName);
    console.log('Received channel name ', channelName );

    const command = `cd ../fabric-network && ./bc-network.sh chaincode deploy-org --cc-name ${chainCodeName} --cc-path ../chaincode-healthcare --cc-version 1.1 --cc-sequence 1 --channel-name ${channelName} --org ${orgName1} --org ${orgName2}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/CreateEMR', (req, res) => {

    const { chainCodeName, orgName, userName, channelName, userId, userDOB, patientName } = req.body;

    let func = `{"Args":["HealthCenter:CreateEmr","{\\"patientId\\":\\"${userId}\\",\\"patientName\\":\\"${patientName}\\",\\"patientBirthdate\\":\\"${userDOB}\\"}"]}`;

    console.log('Received Organization ', orgName);
    console.log('Received user Name', userName);
    console.log('Received chain code Name', chainCodeName);
    console.log('Received channel Name', channelName);

    const command = `cd ../fabric-network && ./bc-network.sh chaincode invoke --cc-name ${chainCodeName} --cc-args '${func}' --user-name ${userName} --org ${orgName} --channel-name ${channelName} `;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/ReadEMR', (req, res) => {

    const { chainCodeName, orgName, userName, channelName, emrID } = req.body;

    let func = `{"Args":["Physician:ReadEmr","${emrID}"]}`;

    console.log('Received emrID ', emrID)
    console.log('Received Organization ', orgName);
    console.log('Received user Name', userName);
    console.log('Received chain code Name', chainCodeName);
    console.log('Received channel Name', channelName);

    const command = `cd ../fabric-network && ./bc-network.sh chaincode invoke --cc-name ${chainCodeName} --cc-args '${func}' --user-name ${userName} --org ${orgName} --channel-name ${channelName} `;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/AddNoteEMR', (req, res) => {

    const { chainCodeName, orgName, userName, channelName, userID, area, vitals, diagnosis, medication } = req.body;

    let func = `{"Args":["Physician:AddEmrNote","{\\"patientId\\":\\"${userID}\\",\\"area\\":\\"${area}\\",\\"vitalSigns\\":\\"${vitals}\\",\\"diagnosis\\":\\"${diagnosis}\\",\\"medication\\":\\"${medication}\\"}"]}`;

    // userID, area, vitals, diagnosis, medication
    console.log('Received medication ', medication);
    console.log('Received diagnosis ', diagnosis);
    console.log('Received vitals ', vitals);
    console.log('Received Area ', area);
    console.log('Received user ID ', userID );
    console.log('Received Organization ', orgName);
    console.log('Received user Name ', userName);
    console.log('Received chain code Name ', chainCodeName);
    console.log('Received channel Name ', channelName);

    const command = `cd ../fabric-network && ./bc-network.sh chaincode invoke --cc-name ${chainCodeName} --cc-args '${func}' --user-name ${userName} --org ${orgName} --channel-name ${channelName} `;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/DownloadEMR', (req, res) => {

    const { chainCodeName, orgName, userName, channelName } = req.body;

    let func = `{"Args":["Patient:GetOwnEmr"]}`;

    console.log('Received Organization ', orgName);
    console.log('Received user Name', userName);
    console.log('Received chain code Name', chainCodeName);
    console.log('Received channel Name', channelName);

    const command = `cd ../fabric-network && ./bc-network.sh chaincode invoke --cc-name ${chainCodeName} --cc-args '${func}' --user-name ${userName} --org ${orgName} --channel-name ${channelName} `;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/SharingEMR', (req, res) => {

    const { chainCodeName, orgName1, orgName2, userName, channelName, emrID } = req.body;

    let func = `{"Args":["HealthCenter:AuthorizeEmrReading","${orgName2}","${emrID}"]}`;

    console.log('Received emrId', emrID);
    console.log('Received Organization 1', orgName1);
    console.log('Received Organization 2', orgName2);
    console.log('Received user Name', userName);
    console.log('Received chain code Name', chainCodeName);
    console.log('Received channel Name', channelName);

    const command = `cd ../fabric-network && ./bc-network.sh chaincode invoke --cc-name ${chainCodeName} --cc-args '${func}' --user-name ${userName} --org ${orgName1} --channel-name ${channelName} `;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/ApproveSharingEMR', (req, res) => {

    const { chainCodeName, orgName1, orgName2, userName, channelName } = req.body;

    let func = `{"Args":["Patient:ApproveEmrSharing","${orgName2}"]}`;

    console.log('Received Organization 1 ', orgName1);
    console.log('Received Organization 2 ', orgName2);
    console.log('Received user Name', userName);
    console.log('Received chain code Name', chainCodeName);
    console.log('Received channel Name', channelName);

    const command = `cd ../fabric-network && ./bc-network.sh chaincode invoke --cc-name ${chainCodeName} --cc-args '${func}' --user-name ${userName} --org ${orgName1} --channel-name ${channelName} `;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.get('/GetSharedEMR', (req, res) => {

    const { chainCodeName, orgName1, orgName2, userName1, userName2, channelName } = req.body;

    let func = `{"Args":["Physician:GetSharedEmr","${orgName1}","${userName1}"]}`;

    console.log('Received Organization 1 ', orgName1);
    console.log('Received Organization 2 ', orgName2);
    console.log('Received user Name 1', userName1);
    console.log('Received user Name 2', userName2);
    console.log('Received chain code Name', chainCodeName);
    console.log('Received channel Name', channelName);

    const command = `cd ../fabric-network && ./bc-network.sh chaincode invoke --cc-name ${chainCodeName} --cc-args '${func}' --user-name ${userName2} --org ${orgName2} --channel-name ${channelName} `;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`error: ${error}`);
            return;
        }
        console.error(`${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send(stdout);
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})