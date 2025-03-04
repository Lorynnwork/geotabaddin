'use strict';

function init() {
    // Create the UI elements
    let container = document.createElement('div');
    container.innerHTML = `
        <h2>Remove Groups from Devices</h2>
        <label for="groupIds">Group IDs (comma-separated):</label><br>
        <textarea id="groupIds" rows="4" cols="50"></textarea><br><br>
        <button id="removeGroupsButton">Remove Groups</button><br><br>
        <div id="status"></div>
    `;
    mygeotab.addin.html.appendChild(container);

    let groupIdsInput = document.getElementById('groupIds');
    let removeGroupsButton = document.getElementById('removeGroupsButton');
    let statusDiv = document.getElementById('status');

    removeGroupsButton.addEventListener('click', async function() {
        let groupIdsString = groupIdsInput.value;
        let groupIds = groupIdsString.split(',').map(id => id.trim());

        statusDiv.innerHTML = 'Processing...';

        try {
            let devices = await mygeotab.api.call('Get', { typeName: 'Device' });
            let updatedCount = 0;

            for (let device of devices) {
                if (device.groups && device.groups.length > 0) {
                    let originalGroupsLength = device.groups.length;
                    let updatedGroups = device.groups.filter(group => !groupIds.includes(group.id));

                    if (updatedGroups.length !== originalGroupsLength) {
                        device.groups = updatedGroups;
                        await mygeotab.api.call('Set', { typeName: 'Device', entity: device });
                        updatedCount++;
                        statusDiv.innerHTML = `Updated ${updatedCount} devices...`;
                    }
                }
            }

            statusDiv.innerHTML = `Completed! Updated ${updatedCount} devices.`;
        } catch (error) {
            console.error('Error removing groups:', error);
            statusDiv.innerHTML = `Error: ${error.message}`;
        }
    });
}

mygeotab.addin.initialize(null, init);