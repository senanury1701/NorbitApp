import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Import Icons
import FeatherIcon from "feather-icons-react";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState<boolean>(false);
    const [isApps, setIsApps] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isPages, setIsPages] = useState<boolean>(false);
    const [isBaseUi, setIsBaseUi] = useState<boolean>(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState<boolean>(false);
    const [isForms, setIsForms] = useState<boolean>(false);
    const [isTables, setIsTables] = useState<boolean>(false);
    const [isCharts, setIsCharts] = useState<boolean>(false);
    const [isIcons, setIsIcons] = useState<boolean>(false);
    const [isMaps, setIsMaps] = useState<boolean>(false);






    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("sub-items");
                const getID = document.getElementById(id) as HTMLElement
                if (getID)
                    getID.classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }

        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }



    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        
    ]);

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: <FeatherIcon icon="bar-chart" className="icon-dual" />,
            link: "/",
        },
        {
            id: "employeeManagement",
            label: "Employee Management",
            icon: <FeatherIcon icon="users" className="icon-dual" />,
            link: "/employeeManangement",
        },
        {
            id: "permissions",
            label: "Permissions",
            icon: <FeatherIcon icon="lock" className="icon-dual" />,
            link: "/permissions",
        },
        {
            id: "accountInformation",
            label: "Account Information",
            icon: <FeatherIcon icon="user" className="icon-dual" />,
            link: "/accountInformation",
        },
        {
            id: "category",
            label: "Category",
            icon: <FeatherIcon icon="list" className="icon-dual" />,
            link: "/category",
        },
        {
            id: "company",
            label: "Company",
            icon: <FeatherIcon icon="briefcase" className="icon-dual" />,
            link: "/company",
        },
        {
            id: "jobs",
            label: "Jobs",
            icon: <FeatherIcon icon="clipboard" className="icon-dual" />,
            link: "/jobs",
        },
        {
            id: "drive",
            label: "Drive",
            icon: <FeatherIcon icon="hard-drive" className="icon-dual" />,
            link: "/drive",
        },
        {
            id: "file",
            label: "File",
            icon: <FeatherIcon icon="file" className="icon-dual" />,
            link: "/file",
        },
        {
            id: "cloud",
            label: "Cloud",
            icon: <FeatherIcon icon="cloud" className="icon-dual" />,
            link: "/cloud",
        },
        {
            id: "knowhow",
            label: "Knowhow",
            icon: <FeatherIcon icon="book" className="icon-dual" />,
            link: "/knowhow",
        },
        {
            id: "dataSheet",
            label: "Data Sheet",
            icon: <FeatherIcon icon="file-text" className="icon-dual" />,
            link: "/dataSheet",
        },
        {
            id: "project",
            label: "Project",
            icon: <FeatherIcon icon="layers" className="icon-dual" />,
            link: "/project",
        },
        {
            id: "inventories",
            label: "Inventories",
            icon: <FeatherIcon icon="box" className="icon-dual" />,
            link: "/inventories",
        },
        {
            id: "apps",
            label: "Apps",
            icon: <FeatherIcon icon="grid" className="icon-dual" />,
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsApps(!isApps);
                setIscurrentState('Apps');
                updateIconSidebar(e);
            },
            stateVariables: isApps,
            subItems: [
                {
                    id: "chat",
                    label: "Chat",
                    link: "/purchases",
                    parentId: "apps",
                },
                {
                    id: "chat2",
                    label: "Chat",
                    link: "/apps-chat",
                    parentId: "apps",
                },
                {
                    id: "chat3",
                    label: "Chat",
                    link: "/apps-chat",
                    parentId: "apps",
                },


            ],
        },

            
        
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;