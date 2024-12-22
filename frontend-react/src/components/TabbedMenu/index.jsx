import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';

// Styled components for the menu and content
const TabbedMenuWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background: ${(props) =>
        props.theme === 'dark'
            ? colors.backgroundLight
            : colors.backgroundLight};
    border: 1px solid
        ${(props) =>
            props.theme === 'dark' ? colors.darkGrey : colors.lightGrey2};
    border-radius: 24px;
    overflow: hidden;
`;

const Tabs = styled.div`
    display: flex;
    justify-content: space-around;
    background-color: ${(props) =>
        props.theme === 'dark' ? colors.darkGrey : colors.lightGrey2};
    border-bottom: 2px solid
        ${(props) =>
            props.theme === 'dark'
                ? colors.backgroundLight
                : colors.backgroundLight};
`;

const Tab = styled.button`
    flex: 1;
    padding: 10px 15px;
    border: none;
    background-color: ${(props) =>
        props.active
            ? props.theme === 'dark'
                ? colors.lightGrey2
                : colors.lightGrey
            : 'transparent'};
    color: ${(props) =>
        props.theme === 'dark' ? colors.backgroundLight : colors.darkGrey};
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: ${(props) =>
            props.theme === 'dark' ? colors.lightGrey : colors.darkGrey};
        color: ${(props) => colors.backgroundLight};
    }
`;

const Content = styled.div`
    padding: 20px;
    background-color: ${(props) =>
        props.theme === 'dark'
            ? colors.backgroundLight
            : colors.backgroundLight};
    color: ${(props) =>
        props.theme === 'dark' ? colors.lightGrey : colors.darkGrey};
    border-top: 1px solid
        ${(props) =>
            props.theme === 'dark' ? colors.darkGrey : colors.lightGrey2};
    min-height: 200px;
`;

const TabbedMenu = ({ pages, theme }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <TabbedMenuWrapper theme={theme}>
            <Tabs theme={theme}>
                {pages.map((page, index) => (
                    <Tab
                        key={index}
                        active={activeTab === index}
                        theme={theme}
                        onClick={() => setActiveTab(index)}
                    >
                        {page.name}
                    </Tab>
                ))}
            </Tabs>
            <Content theme={theme}>{pages[activeTab].content}</Content>
        </TabbedMenuWrapper>
    );
};

export default TabbedMenu;
