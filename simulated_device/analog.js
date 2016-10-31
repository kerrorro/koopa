//@module
/*
 *     Copyright (C) 2010-2016 Marvell International Ltd.
 *     Copyright (C) 2002-2010 Kinoma, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */

exports.pins = {
	analog: {type: "Analog"}
}

PinsSimulators = require("PinsSimulators");

exports.configure = function(configuration, group)
{
    this.pinsSimulator = shell.delegate("addSimulatorPart", {
        header : { 
            label : group,
			name : "Analog In. Pin " + this.analog.pin,
            iconVariant : PinsSimulators.SENSOR_MODULE
        },
		axes : [
			new PinsSimulators.FloatAxisDescription(
				{
					ioType : "input",
					dataType : "float",
					valueLabel : "Percent",
					valueID : "value",
					minValue : 0,
					maxValue : 10,
					value : 5,
					speed : 1,
                    defaultControl: PinsSimulators.SLIDER
				}
			)
		]
    });
}

exports.close = function()
{
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

exports.read = function()
{
	return this.pinsSimulator.delegate("getValue").value;
}

exports.metadata = {
	sources: [
		{
			name: "read",
			result: { type: "Number", name: "value", defaultValue: 0, min: 0, max: 10, decimalPlaces: 3 },
		},
	]
};