import * as joint from 'jointjs';
import React, { useEffect, useRef, useContext } from 'react';

import symbol_resistor from '../../assets/symbol_resistor.png';

import { CircuitGraphContext, PaperContext } from '../../utils/context';

import { symbol } from 'prop-types';

export const Composant = joint.dia.Element.define(
    'logic.Composant',
    {
        size: { width: 80, height: 40 },
        attrs: {
            '.': { magnet: false },
            '.body': { width: 100, height: 50 },
            circle: {
                r: 4,
                stroke: 'black',
                fill: 'black',
                'stroke-width': 1,
                magnet: true,
            },
        },
    },
    {
        useCSSSelectors: true,
        operation: function () {
            return true;
        },
    }
);

export const Dipole = Composant.define(
    'logic.Dipole',
    {
        attrs: {},
    },
    {
        markup: '<g class="rotatable"><g class="scalable"><image class="body"/></g><circle class="input"/><circle class="output"/></g>',
    }
);

export const Tripole = Composant.define(
    'logic.Tripole',
    {
        attrs: {
            '.input1': {
                ref: '.body',
                'ref-x': -2,
                'ref-y': 0.3,
                magnet: 'passive',
                port: 'in1',
            },
            '.input2': {
                ref: '.body',
                'ref-x': -2,
                'ref-y': 0.7,
                magnet: 'passive',
                port: 'in2',
            },
            '.output': {
                ref: '.body',
                'ref-dx': 2,
                'ref-y': 0.5,
                magnet: true,
                port: 'out',
            },
        },
    },
    {
        markup: '<g class="rotatable"><g class="scalable"><image class="body"/></g><circle class="input input1"/><circle  class="input input2"/><circle class="output"/></g>',
    }
);

export const Resistor = Dipole.define(
    'logic.Resistance',
    {
        size: { width: 60, height: 35 },
        attrs: {
            image: {
                'xlink:href':
                    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIENyZWF0ZWQgd2l0aCBJbmtzY2FwZSAoaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvKSAtLT4NCg0KPHN2Zw0KICAgd2lkdGg9IjY2LjUiDQogICBoZWlnaHQ9IjE1LjU2NTI0NyINCiAgIHZpZXdCb3g9IjAgMCAxNy41OTQ3ODkgNC4xMTgzMDUxIg0KICAgdmVyc2lvbj0iMS4xIg0KICAgaWQ9InN2ZzEiDQogICBpbmtzY2FwZTpleHBvcnQtZmlsZW5hbWU9InN5bWJvbF9jYXBhY2l0b3Iuc3ZnIg0KICAgaW5rc2NhcGU6ZXhwb3J0LXhkcGk9Ijk2Ig0KICAgaW5rc2NhcGU6ZXhwb3J0LXlkcGk9Ijk2Ig0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiDQogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPHNvZGlwb2RpOm5hbWVkdmlldw0KICAgICBpZD0ibmFtZWR2aWV3MSINCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIg0KICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCINCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCINCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIg0KICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iIC8+DQogIDxkZWZzDQogICAgIGlkPSJkZWZzMSIgLz4NCiAgPGcNCiAgICAgaW5rc2NhcGU6bGFiZWw9IkNhbHF1ZSAxIg0KICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIg0KICAgICBpZD0ibGF5ZXIxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC4wOTAxNTAyNSwtMC4wNzA5NjM2OCkiPg0KICAgIDxwYXRoDQogICAgICAgaWQ9InBhdGgzOTcwIg0KICAgICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuOTI2MDQyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpiZXZlbDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICAgIGQ9Ik0gMTcuMjIxOTIxLDIuMTMwMTE2MyBIIDE0LjQ0Mzc5NiBMIDEzLjUxNzc1NSwwLjI3ODAzMzA0IDExLjY2NTY3MSwzLjk4MjE5OTQgOS44MTM1ODc4LDAuMjc4MDMzMDQgNy45NjE1MDQ1LDMuOTgyMTk5NCA2LjEwOTQyMTIsMC4yNzgwMzMwNCA0LjI1NzMzNzksMy45ODIxOTk0IDMuMzMxMjk2MiwyLjEzMDExNjMgSCAwLjU1MzE3MTI2Ig0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2NjIiAvPg0KICA8L2c+DQo8L3N2Zz4NCg==',
            },
            label: { text: '100Ω', fill: 'black' },
            '.input': {
                ref: '.body',
                'ref-x': -2,
                'ref-y': 0.5,
                magnet: true, //mettre true pour pouvoir connecter les fils sur les deux ports, 'passive' sinon
                port: 'in',
            },
            '.output': {
                ref: '.body',
                'ref-dx': 2,
                'ref-y': 0.5,
                magnet: true,
                port: 'out',
            },
        },
        value: 100,
        symbol: 'R',
    },
    {
        // Méthode pour modifier dynamiquement la valeur
        setValue: function (newValue) {
            this.value = newValue;
            this.attr('label/text', `${newValue}Ω`);
        },

        // Méthode pour récupérer la valeur actuelle
        getValue: function () {
            return this.value;
        },
    }
);

export const Inductor = Dipole.define(
    'logic.Inductor',
    {
        size: { width: 100, height: 40 },
        attrs: {
            image: {
                'xlink:href':
                    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIENyZWF0ZWQgd2l0aCBJbmtzY2FwZSAoaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvKSAtLT4NCg0KPHN2Zw0KICAgd2lkdGg9IjEwMS41NDM5OSINCiAgIGhlaWdodD0iMTUuODg2OTE0Ig0KICAgdmlld0JveD0iMCAwIDI2Ljg2Njg0NCA0LjIwMzQxMyINCiAgIHZlcnNpb249IjEuMSINCiAgIGlkPSJzdmcxIg0KICAgaW5rc2NhcGU6ZXhwb3J0LWZpbGVuYW1lPSJzeW1ib2xfcmVzaXN0LnN2ZyINCiAgIGlua3NjYXBlOmV4cG9ydC14ZHBpPSI5NiINCiAgIGlua3NjYXBlOmV4cG9ydC15ZHBpPSI5NiINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogIDxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgaWQ9Im5hbWVkdmlldzEiDQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCINCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiDQogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiDQogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iI2QxZDFkMSINCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIiAvPg0KICA8ZGVmcw0KICAgICBpZD0iZGVmczEiIC8+DQogIDxnDQogICAgIGlua3NjYXBlOmxhYmVsPSJDYWxxdWUgMSINCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciINCiAgICAgaWQ9ImxheWVyMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMDA1ODg4ODYsLTAuMDgyNjgyMTEpIj4NCiAgICA8cGF0aA0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgaWQ9InBhdGg0MjAzIg0KICAgICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuOTM3NjgzO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICAgIGQ9Ik0gMjYuNDAzODk2LDMuNzY3MDg0MiBIIDIyLjY5OTczIGMgLTAuMDExMTQsLTQuMzM4ODk2NjkgLTMuNzA5NzMzLC00LjMzODg5NjY5IC0zLjcwNDE2NywwIC0wLjAwNTYsLTQuMzM4OTAxOTggLTMuNzE1MjMxLC00LjMyMzQ4MjA3IC0zLjcwNDE2NiwwIC02LjllLTUsLTQuMzU0MzA2MDMgLTMuNzE1Mzc1LC00LjM1NDMwNjAzIC0zLjcwNDE2NywwIDcuNGUtNSwtNC4zMjM0NzY3OCAtMy42OTg1OTk1LC00LjMzODg5NjY5IC0zLjcwNDE2NjQsMCAtMC4wMTExMzksLTQuMzM4ODk2NjkgLTMuNjgxMjQ4NCwtNC4zMzg4OTY2OSAtMy42ODEyNDg0LDAgSCAwLjQ3NDczMDM1Ig0KICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2MiIC8+DQogIDwvZz4NCjwvc3ZnPg0K',
            },
            label: { text: '0.001F', fill: 'black' },
            '.input': {
                ref: '.body',
                'ref-x': -2,
                'ref-y': 0.6,
                magnet: true,
                port: 'in',
            },
            '.output': {
                ref: '.body',
                'ref-dx': 2,
                'ref-y': 0.6,
                magnet: true,
                port: 'out',
            },
        },
        value: 0.001,
        symbol: 'L',
    },
    {
        // Méthode pour modifier dynamiquement la valeur
        setValue: function (newValue) {
            this.value = newValue;
            this.attr('label/text', `${newValue}µH`);
        },

        // Méthode pour récupérer la valeur actuelle
        getValue: function () {
            return this.value;
        },
    }
);

export const Capacitor = Dipole.define(
    'logic.Capacitor',
    {
        size: { width: 70, height: 80 },
        attrs: {
            image: {
                'xlink:href':
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRlc2M9IkNyZWF0ZWQgd2l0aCBpbWFnZXRyYWNlci5qcyB2ZXJzaW9uIDEuMi42IiA+PHBhdGggZmlsbD0icmdiKDAsMCwwKSIgc3Ryb2tlPSJyZ2IoMCwwLDApIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuOTY0NzA1ODgyMzUyOTQxMiIgZD0iTSAyMjAuNSAxMzkgUSAyMzAuNiAxMzcuNCAyMzMgMTQzLjUgTCAyMzUgMTQ4LjUgTCAyMzUgMzYzLjUgUSAyMzMuOCAzNjkuMyAyMjkuNSAzNzIgTCAyMjAuNSAzNzMgTCAyMTUgMzY4LjUgTCAyMTMgMzY0LjUgTCAyMTMgMjY3IEwgNTIuNSAyNjcgUSA0Ni44IDI2NS44IDQ0IDI2MS41IEwgNDMgMjUyLjUgTCA0Ny41IDI0NyBMIDUxLjUgMjQ1IEwgMjEzIDI0NSBMIDIxMyAxNDcuNSBMIDIxOC41IDE0MCBMIDIyMC41IDEzOSBaICIgLz48cGF0aCBmaWxsPSJyZ2IoMCwwLDApIiBzdHJva2U9InJnYigwLDAsMCkiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC45NjQ3MDU4ODIzNTI5NDEyIiBkPSJNIDI4NC41IDEzOSBRIDI5NC42IDEzNy40IDI5NyAxNDMuNSBMIDI5OSAxNDguNSBMIDI5OSAyNDUgTCA0NjAuNSAyNDUgTCA0NjggMjUwLjUgTCA0NjkgMjU5LjUgTCA0NjQuNSAyNjUgTCA0NTkuNSAyNjcgTCAyOTkgMjY3IEwgMjk5IDM2My41IFEgMjk3LjggMzY5LjMgMjkzLjUgMzcyIEwgMjg0LjUgMzczIEwgMjc5IDM2OC41IEwgMjc3IDM2NC41IEwgMjc3IDE0Ny41IEwgMjgyLjUgMTQwIEwgMjg0LjUgMTM5IFogIiAvPjxwYXRoIGZpbGw9InJnYigwLDAsMCkiIHN0cm9rZT0icmdiKDAsMCwwKSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwIiBkPSJNIDAgMCBMIDUxMiAwIEwgNTEyIDUxMiBMIDAgNTEyIEwgMCAwIFogTSAyMjEgMTM5IEwgMjE5IDE0MCBMIDIxMyAxNDggTCAyMTMgMjQ1IEwgNTIgMjQ1IEwgNDggMjQ3IEwgNDMgMjUzIEwgNDQgMjYyIFEgNDcgMjY2IDUzIDI2NyBMIDIxMyAyNjcgTCAyMTMgMzY1IEwgMjE1IDM2OSBMIDIyMSAzNzMgTCAyMzAgMzcyIFEgMjM0IDM2OSAyMzUgMzY0IEwgMjM1IDE0OSBMIDIzMyAxNDQgUSAyMzEgMTM3IDIyMSAxMzkgWiBNIDI4NSAxMzkgTCAyODMgMTQwIEwgMjc3IDE0OCBMIDI3NyAzNjUgTCAyNzkgMzY5IEwgMjg1IDM3MyBMIDI5NCAzNzIgUSAyOTggMzY5IDI5OSAzNjQgTCAyOTkgMjY3IEwgNDYwIDI2NyBMIDQ2NSAyNjUgTCA0NjkgMjYwIEwgNDY4IDI1MSBMIDQ2MSAyNDUgTCAyOTkgMjQ1IEwgMjk5IDE0OSBMIDI5NyAxNDQgUSAyOTUgMTM3IDI4NSAxMzkgWiAiIC8+PC9zdmc+',
            },
            label: { text: '1µF', fill: 'black' },
            '.input': {
                ref: '.body',
                'ref-x': -2,
                'ref-y': 0.5,
                magnet: true, //mettre true pour pouvoir connecter les fils sur les deux ports, 'passive' sinon
                port: 'in',
            },
            '.output': {
                ref: '.body',
                'ref-dx': 2,
                'ref-y': 0.5,
                magnet: true,
                port: 'out',
            },
        },
        value: 0.001,
        symbol: 'C',
    },
    {
        // Méthode pour modifier dynamiquement la valeur
        setValue: function (newValue) {
            this.value = newValue;
            this.attr('label/text', `${newValue}µF`);
        },

        // Méthode pour récupérer la valeur actuelle
        getValue: function () {
            return this.value;
        },
    }
);

export const AOP = Tripole.define(
    'logic.AOP',
    {
        size: { width: 120, height: 60 },
        attrs: {
            image: {
                'xlink:href':
                    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIENyZWF0ZWQgd2l0aCBJbmtzY2FwZSAoaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvKSAtLT4NCg0KPHN2Zw0KICAgd2lkdGg9IjczLjUwMDAwOCINCiAgIGhlaWdodD0iNjEuNjYzMTE2Ig0KICAgdmlld0JveD0iMCAwIDE5LjQ0Njg3MSAxNi4zMTUwNDQiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0ic3ZnMSINCiAgIGlua3NjYXBlOmV4cG9ydC1maWxlbmFtZT0ic3ltYm9sX2N1cnJlbnRfc3JjLnN2ZyINCiAgIGlua3NjYXBlOmV4cG9ydC14ZHBpPSI5NiINCiAgIGlua3NjYXBlOmV4cG9ydC15ZHBpPSI5NiINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogIDxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgaWQ9Im5hbWVkdmlldzEiDQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCINCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiDQogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiDQogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iI2QxZDFkMSINCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIiAvPg0KICA8ZGVmcw0KICAgICBpZD0iZGVmczEiIC8+DQogIDxnDQogICAgIGlua3NjYXBlOmxhYmVsPSJDYWxxdWUgMSINCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciINCiAgICAgaWQ9ImxheWVyMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMDg3MjIxNikiPg0KICAgIDxnDQogICAgICAgaWQ9Imc1ODcyIg0KICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsLTMzNi41Mjg5MiwyNy42MjY0NDIpIg0KICAgICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZSI+DQogICAgICA8cGF0aA0KICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjJweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxIg0KICAgICAgICAgZD0ibSAxMjk2Ljc1LC04Ny41ODMzNSBoIC0xMC41Ig0KICAgICAgICAgaWQ9InBhdGgyNzU3Ig0KICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjYyIgLz4NCiAgICAgIDxwYXRoDQogICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MnB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgICAgICBkPSJtIDEyOTEuNSwtODIuMzMzMzUgdiAtMTAuNSINCiAgICAgICAgIGlkPSJwYXRoMjc1OSINCiAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2MiIC8+DQogICAgICA8cGF0aA0KICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjYyINCiAgICAgICAgIGlkPSJwYXRoMjc3MSINCiAgICAgICAgIGQ9Im0gMTI5Ni43NSwtNTkuNTgzMzUgaCAtMTAuNSINCiAgICAgICAgIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjJweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxIg0KICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4NCiAgICAgIDxwYXRoDQogICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgaWQ9InBhdGg1ODIwIg0KICAgICAgICAgZD0ibSAxMjc0LC04Ny41ODMzNSBoIDciDQogICAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6My41O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjEiIC8+DQogICAgICA8cGF0aA0KICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgIGlkPSJwYXRoNTgyMiINCiAgICAgICAgIGQ9Im0gMTI3NCwtNTkuNTgzMzUgaCA3Ig0KICAgICAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjMuNTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxIiAvPg0KICAgICAgPHBhdGgNCiAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgICBpZD0icGF0aDU4MjQiDQogICAgICAgICBkPSJtIDEyODEsLTEwMS41ODMzNSB2IDU2IGwgNTYsLTI4IHoiDQogICAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6My41O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjEiIC8+DQogICAgICA8cGF0aA0KICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjYyINCiAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgICBpZD0icGF0aDU4MjYiDQogICAgICAgICBkPSJtIDEzMzcsLTczLjU4MzM1IGggNyINCiAgICAgICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDpub25lO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDozLjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MSIgLz4NCiAgICA8L2c+DQogIDwvZz4NCjwvc3ZnPg0K',
            },
            '.input1': {
                ref: '.body',
                'ref-x': 0,
                'ref-y': 0.3,
                magnet: true,
                port: 'in1',
            },
            '.input2': {
                ref: '.body',
                'ref-x': 0,
                'ref-y': 0.7,
                magnet: true,
                port: 'in2',
            },
            '.output': {
                ref: '.body',
                'ref-dx': 1,
                'ref-y': 0.5,
                magnet: true,
                port: 'out',
            },
        },
    },
    {
        operation: function (in1, in2) {
            // Your op-amp logic here
            return in1 - in2;
        },
    }
);

export const Wire = joint.dia.Link.define(
    'logic.Wire',
    {
        attrs: {
            '.connection': { 'stroke-width': 2 },
            '.marker-vertex': { r: 7 },
        },

        router: { name: 'manhattan' },
        connector: { name: 'normal', args: { radius: 10 } },
    },
    {
        useCSSSelectors: true,
        arrowheadMarkup: [
            '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
            '<circle class="marker-arrowhead" end="<%= end %>" r="7"/>',
            '</g>',
        ].join(''),

        vertexMarkup: [
            '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
            '<circle class="marker-vertex" idx="<%= idx %>" r="10" />',
            '<g class="marker-vertex-remove-group">',
            '<path class="marker-vertex-remove-area" idx="<%= idx %>" d="M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z" transform="translate(5, -33)"/>',
            '<path class="marker-vertex-remove" idx="<%= idx %>" transform="scale(.8) translate(9.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">',
            '<title>Remove vertex.</title>',
            '</path>',
            '</g>',
            '</g>',
        ].join(''),
    }
);

export const shapes = {
    ...joint.shapes,
    logic: {
        Resistor,
        Inductor,
        Capacitor,
        AOP,
    },
};

// Fonction pour créer un noeud
function createNode(graph, position) {
    const hub = new joint.shapes.standard.Circle();
    hub.position(position.x, position.y);
    hub.resize(20, 20); // Taille du nœud
    hub.attr({
        body: { fill: 'blue' },
        label: { text: '', fill: 'white' },
    });
    hub.addTo(graph);
    return hub;
}

function getIntersection(p1, p2, p3, p4) {
    const det = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);

    if (det === 0) return null; // Les segments sont parallèles ou colinéaires

    const lambda =
        ((p4.y - p3.y) * (p4.x - p1.x) - (p4.x - p3.x) * (p4.y - p1.y)) / det;
    const gamma =
        ((p1.y - p2.y) * (p4.x - p1.x) - (p1.x - p2.x) * (p4.y - p1.y)) / det;

    // Vérifie si l'intersection est dans les limites des deux segments
    if (lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1) {
        return {
            x: p1.x + lambda * (p2.x - p1.x),
            y: p1.y + lambda * (p2.y - p1.y),
        };
    }

    return null; // Pas d'intersection
}

const enablePanning = (paper) => {
    let isPanning = false;
    let startX, startY;

    paper.on('blank:pointerdown', (evt, x, y) => {
        isPanning = true;
        startX = evt.clientX;
        startY = evt.clientY;
    });

    document.addEventListener('mousemove', (evt) => {
        if (!isPanning) return;

        const dx = evt.clientX - startX;
        const dy = evt.clientY - startY;
        startX = evt.clientX;
        startY = evt.clientY;

        const translate = paper.translate();
        paper.translate(translate.tx + dx, translate.ty + dy);
    });

    document.addEventListener('mouseup', () => {
        isPanning = false;
    });
};

const enableZoom = (paper) => {
    const zoomStep = 0.1; // Incrément du zoom
    const minZoom = 0.5; // Zoom minimal
    const maxZoom = 2; // Zoom maximal

    paper.on('blank:mousewheel', (evt, x, y, delta) => {
        const currentScale = paper.scale();
        const newScale = Math.min(
            Math.max(currentScale.sx + delta * zoomStep, minZoom),
            maxZoom
        );

        paper.scale(newScale, newScale, x, y); // Zoom au niveau du pointeur
    });
};

const JointWorkspace = ({ onDrop, onDragOver }) => {
    const { circuitGraph, setCircuitGraph } = useContext(CircuitGraphContext);
    const { paper, setPaper } = useContext(PaperContext);
    const graphContainerRef = useRef(null);

    useEffect(() => {
        // Initialisation du graphe et du papier
        const graph = new joint.dia.Graph();
        const paper = new joint.dia.Paper({
            el: graphContainerRef.current,
            model: graph,
            width: '100vh',
            height: '45vh',
            gridSize: 20,
            drawGrid: true,
            snapLinks: false,
            defaultLink: () => new Wire(),
        });

        paper.on('cell:pointerdblclick', function (cellView) {
            const cell = cellView.model;

            // Vérifie si l'élément cliqué est une résistance
            if (cell.isElement() && cell instanceof Resistor) {
                // Demande la nouvelle valeur
                const nouvelleValeur = prompt(
                    'Entrez la nouvelle valeur de la résistance (Ω) :',
                    cell.getValeur() // Pré-remplit avec la valeur actuelle
                );

                // Si une nouvelle valeur est saisie et qu'elle est valide, on la met à jour
                if (nouvelleValeur !== null && !isNaN(nouvelleValeur)) {
                    cell.setValeur(parseFloat(nouvelleValeur));
                } else {
                    alert('Veuillez entrer une valeur numérique valide.');
                }
            }
            /*    
            // Vérifie si l'élément cliqué est un condensateur
            if (cell.isElement() && cell instanceof Condensateur) {
                // Demande la nouvelle valeur
                const nouvelleValeur = prompt(
                    'Entrez la nouvelle valeur du condensateur (F) :', 
                    cell.getValeur() // Pré-remplit avec la valeur actuelle
                );
        
                // Si une nouvelle valeur est saisie et qu'elle est valide, on la met à jour
                if (nouvelleValeur !== null && !isNaN(nouvelleValeur)) {
                    cell.setValeur(parseFloat(nouvelleValeur));
                } else {
                    alert("Veuillez entrer une valeur numérique valide.");
                }
            }

            // Vérifie si l'élément cliqué est une Bobine
            if (cell.isElement() && cell instanceof Bobine) {
                // Demande la nouvelle valeur
                const nouvelleValeur = prompt(
                    'Entrez la nouvelle valeur de la bobine (H) :', 
                    cell.getValeur() // Pré-remplit avec la valeur actuelle
                );
        
                // Si une nouvelle valeur est saisie et qu'elle est valide, on la met à jour
                if (nouvelleValeur !== null && !isNaN(nouvelleValeur)) {
                    cell.setValeur(parseFloat(nouvelleValeur));
                } else {
                    alert("Veuillez entrer une valeur numérique valide.");
                }
            }*/
        });

        // NOEUDS
        // Surveiller les liens pour créer des hubs dynamiquement
        graph.on('change:target', function (link) {
            const target = link.get('target'); // Récupère la cible actuelle du lien déplacé
            if (!target || target.id) return; // Assurez-vous que la cible est une position libre (pas un élément)

            const sourcePosition = link.source().id
                ? graph.getCell(link.source().id).position()
                : link.source(); // Position de la source du lien déplacé
            const targetPosition = target; // Position actuelle de l'extrémité déplacée

            // Vérifier les intersections avec d'autres liens
            graph.getLinks().forEach((otherLink) => {
                if (otherLink === link) return; // Ignore le lien lui-même

                const otherSourcePosition = otherLink.source().id
                    ? graph.getCell(otherLink.source().id).position()
                    : otherLink.source();
                const otherTargetPosition = otherLink.target().id
                    ? graph.getCell(otherLink.target().id).position()
                    : otherLink.target();

                // Vérifie si les deux segments de liens se croisent
                const intersection = getIntersection(
                    sourcePosition,
                    targetPosition,
                    otherSourcePosition,
                    otherTargetPosition
                );

                if (intersection) {
                    // Vérifie s'il existe déjà un nœud proche de l'intersection
                    const radius = 70; // Rayon de proximité (en pixels)
                    const existingNode = graph.getElements().find((element) => {
                        const position = element.position();
                        return (
                            Math.abs(position.x - intersection.x) < radius &&
                            Math.abs(position.y - intersection.y) < radius
                        );
                    });

                    if (!existingNode) {
                        // Crée un nœud à la position de l'intersection
                        const hub = createNode(graph, intersection);

                        // Connecte immédiatement le lien déplacé au nœud
                        link.set('target', { id: hub.id, port: 'in' });

                        // Coupe le lien existant en deux et connecte les segments au nœud
                        const newLink = new joint.dia.Link({
                            source: { id: hub.id, port: 'out' },
                            target: otherLink.target(),
                        }).addTo(graph);
                        otherLink.set('target', { id: hub.id, port: 'in' });

                        console.log(
                            'Intersection détectée, nœud créé et lien connecté !'
                        );
                    } else {
                        // Connecte directement le lien au nœud existant
                        link.set('target', { id: existingNode.id, port: 'in' });
                        console.log(
                            'Un nœud existant a été utilisé pour connecter le lien.'
                        );
                    }
                }
            });
        });

        var allEdges = graph.getLinks();
        console.log('Test');
        console.log(allEdges);

        setCircuitGraph(graph);

        // Activer le zoom et le déplacement
        enableZoom(paper);
        enablePanning(paper);
        setPaper(paper);

        // Update zoom level in state on scale change
        paper.on('scale', setPaper(paper)); // Assuming uniform scaling
    }, []);

    return (
        <>
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                ref={graphContainerRef}
            />
        </>
    );
};

export default JointWorkspace;
