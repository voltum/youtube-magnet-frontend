import React from "react";
import { useLocation } from "react-router-dom";
import { Folder } from "./channels";

export function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const parseToTree = function (nodes: Folder[], parent: string = '/', childrenPropName: string = "children") {
    return nodes.filter(node => {
        return node.parent === parent
    })
        .reduce((tree, node): any => {
            return [
                ...tree,
                {
                    ...node,
                    label: node.name,
                    value: node.category,
                    [childrenPropName]: parseToTree(nodes, node.category, childrenPropName)
                }
            ]
        }, []);
}