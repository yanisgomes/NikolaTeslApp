import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import fonts from './../../utils/style/fonts';

// Styled components for the menu and content
const TabbedMenuWrapper = styled.div`
    display: flex;
    flex-direction: column;

    height: 100%;
    align-self: stretch;

    background: ${(props) =>
        props.theme === 'dark'
            ? colors.backgroundLight
            : colors.backgroundLight};
    border: 1px solid
        ${(props) =>
            props.theme === 'dark' ? colors.darkGrey : colors.lightGrey2};
    border-radius: 16px;
    overflow: hidden;
`;

const Tabs = styled.ul`
    display: flex;
    justify-content: space-around;
    background-color: ${(props) =>
        props.theme === 'dark'
            ? colors.darkBackground
            : colors.backgroundLight};
    border-bottom: 2px solid
        ${(props) =>
            props.theme === 'dark'
                ? colors.backgroundLight
                : colors.backgroundLight};
    list-style: none;
    padding: 0;
    margin: 0;
`;

const Tab = styled.li`
    flex: 1;
    text-align: center;

    & > a {
        display: block;
        padding: 10px 5px;
        text-decoration: none;

        font-family: ${fonts.mainFont};
        font-size: 14px;
        font-weight: normal;

        color: ${(props) =>
            props.theme === 'dark' ? colors.lightGrey : colors.darkGrey};
        background-color: ${(props) =>
            props.active
                ? props.theme === 'dark'
                    ? colors.lightGrey2
                    : colors.lightGrey
                : 'transparent'};

        border-bottom: ${(props) =>
            props.active
                ? `3px solid ${
                      props.theme === 'dark' ? colors.primary : colors.primary
                  }`
                : 'none'};

        transition: background-color 0.3s, color 0.3s, border-bottom 0.3s;

        &:hover {
            color: ${(props) => colors.primary};
        }
    }
`;

const Content = styled.div`
    padding: 16px;
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
                    <Tab key={index} active={activeTab === index} theme={theme}>
                        <a href="#" onClick={() => setActiveTab(index)}>
                            {page.name}
                        </a>
                    </Tab>
                ))}
            </Tabs>
            <Content theme={theme}>{pages[activeTab].content}</Content>
        </TabbedMenuWrapper>
    );
};

export default TabbedMenu;
