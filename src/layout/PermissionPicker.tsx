import React, {forwardRef, useImperativeHandle, useState} from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import { TransitionProps } from '@mui/material/transitions';
import { useSpring, animated } from '@react-spring/web';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import {FormControlLabel, Checkbox} from '@mui/material';
import Role from "../commons/models/Role";

function MinusSquare(props: SvgIconProps) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props: SvgIconProps) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props: SvgIconProps) {
    return (
        <SvgIcon
            className="close"
            fontSize="inherit"
            style={{ width: 14, height: 14 }}
            {...props}
        >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
        from: {
            opacity: 0,
            transform: 'translate3d(20px,0,0)',
        },
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
        },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

const StyledTreeItem = styled((props: TreeItemProps) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}));

const treefyData  = (data: any[] , defaultValue: any| undefined | null): any[] => {


    const treefiedData: any[] = [];
    data.forEach((item: any) => {
        const codes = item.code.split('.');
        const parentCode = codes[0];
        const idCurrent = item.id;

        if (!parentCode)
            return;

        let parent = treefiedData.find(p => p.code === parentCode);

        if(parent) {
            if(!parent.treefyMetadata.isChecked)
                parent.treefyMetadata.isChecked =  !!(defaultValue && defaultValue.permissions.find((p: number) => p === idCurrent));
        }

        // If parent is not found, create it
        if (!parent) {
            parent = {
                code: parentCode,
                name: parentCode,
                treefyMetadata: {
                    treeId: `parent_${item.id}`,
                    path: [treefiedData.length],
                    children: [],
                    isChecked: false,
                    isIntermediate: false,
                    isTreeExpanded: false,
                }
            }
            treefiedData.push(parent);
        }

        // Add permission to parent
        parent.treefyMetadata.children.push({
            id: item.id,
            code: item.code,
            name: item.name,
            treefyMetadata: {
                treeId: `${item.id}`,
                path: [
                    ...parent.treefyMetadata.path,
                    parent.treefyMetadata.children.length
                ],
                children: [],
                isChecked: !!(defaultValue && defaultValue.permissions.find((p: number) => p === idCurrent)),
                isIntermediate: false,
                isTreeExpanded: false,
            }
        });
    });

    return treefiedData;
}

type pickerProps = {
    data: any[],
    defaultSelected?: Role| undefined| null
}

const PermissionPicker = forwardRef(({data, defaultSelected}: pickerProps, _ref) => {

    const [nodesData, setNodesData] = useState<any[]>(treefyData(data, defaultSelected));

    const loadItem = (data : any[]) => (
        <>
            {data.map(node => (
                <StyledTreeItem
                    key={node.treefyMetadata.treeId}
                    nodeId={node.treefyMetadata.treeId}
                    label={
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={node.treefyMetadata.isChecked}
                                    indeterminate={!node.treefyMetadata.isChecked && node.treefyMetadata.isIntermediate}
                                    onChange={(event) =>
                                        updateNode(event.currentTarget.checked, node.treefyMetadata.path)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                />
                            }
                            label={<>{node.name}</>}
                            key={node.treefyMetadata.treeId}
                        />
                    }
                >
                    {node.treefyMetadata.children.length > 0 && (
                        loadItem(node.treefyMetadata.children)
                    )}
                </StyledTreeItem>
            ))}
        </>
    );

    const getNodeByPath = (path:any, nodes:any) => {
        let currentNodes = nodes;
        return path.reduce(
            (result:any, current:any) => {
                const tmp = Array.isArray(currentNodes)
                    ? currentNodes[current]
                    : currentNodes.treefyMetadata
                        ? currentNodes.treefyMetadata.children[current]
                        : undefined;

                if (tmp) {
                    currentNodes = tmp;
                    return tmp;
                }

                return undefined;
            },
            undefined
        );
    }

   const getSelectedNodes = (nodes: any[]) => {
        const selectedNodes: any[] = [];
        (nodes || nodesData).forEach(node => {
            const _node = {...node};
            delete _node.treefyMetadata;

            if (node.id !== undefined && node.treefyMetadata.isChecked) {
                selectedNodes.push(_node);
            }

            if (node.treefyMetadata.children.length > 0) {
                const childSelectedNodes = getSelectedNodes(node.treefyMetadata.children);
                if (childSelectedNodes.length > 0)
                    selectedNodes.push(...childSelectedNodes);
            }
        });
        return selectedNodes;
    }

    const getParentNode = (node: any, nodes: any[]) => {
        return getNodeByPath(node.treefyMetadata.path.slice(0, -1), nodes);
    }

   const updateAncestorNodes: any = (node: any, nodes: any[]) => {
        node.treefyMetadata.isChecked = node.treefyMetadata.children.every((n: { treefyMetadata: { isChecked: any; }; }) => n.treefyMetadata.isChecked);
        node.treefyMetadata.isIntermediate = node.treefyMetadata.children.some((n: { treefyMetadata: { isChecked: any; isIntermediate: any; }; }) => n.treefyMetadata.isChecked || n.treefyMetadata.isIntermediate);

        const parentNode = getParentNode(node, nodes);
        if (parentNode)
            return updateAncestorNodes(parentNode, nodes);
    }

    const updateDescendantsNodes = (parentIncomingCheckedState:any, node:any, nodes:any) => {
        node.treefyMetadata.isChecked = parentIncomingCheckedState;
        node.treefyMetadata.isIntermediate = false;
        node.treefyMetadata.children.forEach((child: any) => {
            updateDescendantsNodes(parentIncomingCheckedState, child, nodes);
        });
    }

    const updateNode = (incomingCheckedState:any, path:any) => {
        // Clone data
        const nodes = [...nodesData];
        // Try to get concerned item
        const node = getNodeByPath(path, nodes);

        // If item is found, update it
        if (node) {
            node.treefyMetadata.isChecked = incomingCheckedState;
            node.treefyMetadata.isIntermediate = false;

            node.treefyMetadata.children.forEach((child: any) => {
                updateDescendantsNodes(incomingCheckedState, child, nodes);
            });

            const parentNode = getParentNode(node, nodes);
            if (parentNode)
                updateAncestorNodes(parentNode, nodes);

            setNodesData(nodes);
        }
    }

    useImperativeHandle(_ref, () => ({
        getSelectedNode: getSelectedNodes,
    }))



    return (
        <TreeView
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
        >
            {loadItem(nodesData)}
        </TreeView>
    )
})
export default PermissionPicker;
