import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Import Icons
import FeatherIcon from "feather-icons-react";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isPurchases, setIsPurchases] = useState<boolean>(false);
    const [isApps, setIsApps] = useState<boolean>(false);
   

    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("sub-items");
                const getID = document.getElementById(id) as HTMLElement;
                if (getID)
                    getID.classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Purchases') {
            setIsApps(false);
        }
    }, [
        history,
        iscurrentState,
        isPurchases,
        
    ]);

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: <FeatherIcon icon="home" className="icon-dual" />,
            link: "/",
            
        },
        {
            id: "category",
            label: "Category",
            icon: <FeatherIcon icon="grid" className="icon-dual" />,
            link: "/category",
            
        },
        {
            id: "emplooyeManangement",
            label: "EmplooyeManangement",
            icon: <FeatherIcon icon="clarity-employee-group-line" className="icon-dual" />,
            link: "/employeeManangement",
        },
        {
            id: "permissions",
            label: "Permissions",
            icon: <FeatherIcon icon="grid" className="icon-dual" />,
            link: "/permissions",
        },
        {
            id: "accountInformation",
            label: "AccountInformation",
            icon: <FeatherIcon icon="grid" className="icon-dual" />,
            link: "/accountInformation",
        },
        {
            id: "company",
            label: "Company",
            icon: <FeatherIcon icon="grid" className="icon-dual" />,
            link: "/company",
        },
        {
            id: "jobs",
            label: "Jobs",
            icon: <FeatherIcon icon="grid" className="icon-dual" />,
            link: "/jobs",
        },
        {
            id: "inventories",
            label: "Inventories",
            icon: <FeatherIcon icon="grid" className="icon-dual" />,
            link: "/inventories",
        },
        {
            id: "purchases",
            label: "Purchases",
            icon: <FeatherIcon icon="home" className="icon-dual" />,
            link: "/#",
            stateVariables: isPurchases,
            click: function (e: any) {
                e.preventDefault();
                setIsPurchases(!isPurchases);
                setIscurrentState('Purchases');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "purchases",
                    label: "Purchases",
                    link: "#",
                    parentId: "purchases",
                },
                {
                    id: "purchasesList",
                    label: "PurchasesList",
                    link: "#",
                    parentId: "purchases",
                },
                {
                    id: "purchasesCategory",
                    label: "purchasesCategory",
                    link: "#",
                    parentId: "purchases",
                },
                
            ],
        },

            
        
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;