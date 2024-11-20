import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import { TransitionProps } from '@mui/material/transitions';
import { useSpring, animated } from '@react-spring/web';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import {FormControlLabel, Checkbox} from '@mui/material';
import Role from "../commons/models/Role";
import csuClient from "../network";
import Spinner from "../components/bootstrap/Spinner";
import VisibilityGroup from "../commons/models/VisibilityGroup";
import {useAppDispatch, useAppSelector} from "../store/redux.types";
import treeVisility from "../store/slices/treeVisibility/reducer";
import {setTree} from "../store/slices/treeVisibility/action";

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


// const allFosa = async (itemCurrent: any,  currentPath: any[], defaultValue: any) => {
//     const dataFosa: any[] = [];
//     const district: any[] = await csuClient.location.fosa.getAll({district_id:itemCurrent.id, page_size: 1000})
//         .then((resp) => {
//             return resp.data.results
//         })
//     district.forEach((item) => {
//         const node: any = {};
//         node.id = `${item.id}fos`;
//         node.value = item.name;
//         node.isChecked = !!(defaultValue && defaultValue.districts.find((p: string) => p === item.id));
//         node.fosaId = item.id;
//         node.type = 4;
//         node.isIntermediate = false;
//         node.path = [...currentPath, dataFosa.length];
//         node.children = null
//         dataFosa.push(node);
//     });
//
//     return dataFosa
// }

const allDistrict = async (itemCurrent: any,  currentPath: any[], defaultValue: any) => {
    const dataDistrict: any[] = [];
    const districts: any[] = await csuClient.location.districts.getAll({department_id:itemCurrent.id, page_size: 1000})
        .then((resp) => {
            return resp.data.results
        })


    for (const item of districts) {
        const node: any = {};
        node.id = `${item.id}dis`;
        node.value = item.name;
        node.isChecked = !!(defaultValue && defaultValue.districts.find((p: string) => p === item.id as string));
        node.districtId = item.id;
        node.type = 3;
        node.isIntermediate = false;
        node.path = [...currentPath, dataDistrict.length];
        node.children = null
        // node.children = await allFosa(item, [...currentPath, dataDistrict.length], defaultValue)
        dataDistrict.push(node);
    }

    return dataDistrict
}

const allDepartment = async (itemCurrent:any, currentPath:any[], defaultValue: any) => {
    const dataDepartment: any[] = [];
    const department: any[] = await csuClient.location.departments.getAll({region_id:itemCurrent.id, page_size: 1000})
        .then((resp) => resp.data.results);
    for (const item of department) {
        const node: any = {};
        node.id = `${item.id}dep`;
        node.value = item.name;
        node.type = 2;
        node.isIntermediate = false;
        node.path = [...currentPath, dataDepartment.length];
        node.children = await allDistrict(item, [...currentPath, dataDepartment.length], defaultValue)
        if (defaultValue) {
            const hasChildrenTrue: boolean = !!node.children.find((item:any) => item.isChecked === true)
            node.isChecked = hasChildrenTrue;
        }else node.isChecked = false

        dataDepartment.push(node);
    }

    return dataDepartment

}

const treefyData = async (data: any[] , defaultValue: any| undefined | null) => {

    const treefiedData: any[] = [];
    for (const item of data) {
        const node: any = {};
        node.id = item.id;
        node.value = item.name;
        // node.isChecked = !!(defaultValue && defaultValue.districts.find((p: string) => p === item.id));
        node.isIntermediate = false;
        node.type = 1;
        node.path = [treefiedData.length]
        node.children = await allDepartment(item, [treefiedData.length], defaultValue)
        if (defaultValue) {
            const hasChildrenTrue: boolean = !!node.children.find((item:any) => item.isChecked === true)
            node.isChecked = hasChildrenTrue;
        }else node.isChecked = false

        treefiedData.push(node)
    }

    return treefiedData;
}

type pickerProps = {
    data: any[],
    defaultSelected?: VisibilityGroup| undefined| null

}

const PermissionPicker = forwardRef(({data, defaultSelected}: pickerProps, _ref) => {

    const [nodesData, setNodesData] = useState<any[]>();
    // const treeNode = useAppSelector(({treeVisility}) => treeVisility.treeNode);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (defaultSelected) {
            treefyData(data, defaultSelected).then((res) => {
                setNodesData(res)
            })
        } else {
            treefyData(data, defaultSelected).then((res) => {
                setNodesData(res)
                // dispatch(setTree(res))
            })
        }


    },[])

    const loadItem = (data : any[]) => (
        <>
            {data.map(node => (
                <StyledTreeItem
                    nodeId={node.id}
                    label={
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={node.isChecked}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(event) =>
                                        updateNode(event.currentTarget.checked, node)
                                    }
                                    indeterminate={node.isIntermediate}
                                />
                            }
                            label={<>{node.value}</>}
                            key={node.id}
                        />
                    }
                >
                    {node.children && loadItem(node.children)}
                </StyledTreeItem>
            ))}
        </>
    );

    const getNodeByPath = (path: any[], nodes: any[]) => {
        let currentNode = nodes;
        let tmpNode = null;
        path.forEach((item: any) => {
            tmpNode = currentNode[item];
            if (tmpNode) currentNode = tmpNode.children;
        });
        return tmpNode;
    }

    const getSelectedNodes = (nodes: any[]): any[] => {
        const selectedNode: any[] = [];
        (nodes || nodesData).forEach((node) => {
            const _node = {...node};
            delete _node.children;
            delete _node.id;
            delete _node.isChecked;
            delete _node.type;
            delete _node.isIntermediate;
            delete _node.path;
            if (node.isChecked && node.type === 3) selectedNode.push(_node);
            if (node.children) {
                const selectedChild: any[] = getSelectedNodes(node.children);
                if (selectedChild.length > 0) selectedNode.push(...selectedChild)
            }
        });

        return selectedNode;
    };

    const getParentNode = (path:any[], nodes: any[]) => {
        return getNodeByPath(path.slice(0, -1), nodes);
    };

    const updateAncestror: any = (node: any, nodes: any[]) => {
        const parentNode: any = getParentNode(node.path, nodes);
        // eslint-disable-next-line no-restricted-syntax
        for (const item of parentNode.children) {
            if ((item.isChecked !== node.isChecked) || item.isIntermediate) {
                parentNode.isIntermediate = true;
                break
            } else {
                parentNode.isIntermediate = false;
                parentNode.isChecked = item.isChecked;
            }
        }

        if (parentNode.path.length > 1) {
            updateAncestror(parentNode, nodes);
        };
    }

    const updataDescendantNodes = (statusCheck: any, node: any, nodes: any[]) => {
        if (node.children) {
            node.children.forEach((item: any) => {
                item.isChecked = statusCheck;
                node.isIntermediate = false;
                if (item.children) updataDescendantNodes(statusCheck, item, nodes);
            })
        }
    }

    const updateNode = (incommingCheeck: any, node: any) => {
        if (nodesData) {
            const nodes = [...nodesData];
            if (node) {
                node.isChecked = incommingCheeck;
                node.isIntermediate = false;
                if (node.children) {
                    updataDescendantNodes(incommingCheeck,node, nodes)
                };
                if (node.path.length > 1) updateAncestror(node, nodes)
            }

            setNodesData(nodes);
        }
    }

    useImperativeHandle(_ref, () => ({
        getSelectedNode: getSelectedNodes,
    }))



    return (
        <>
            {nodesData ? (
                <TreeView
                    defaultCollapseIcon={<MinusSquare />}
                    defaultExpandIcon={<PlusSquare />}
                    defaultEndIcon={<CloseSquare />}
                >
                    {loadItem(nodesData)}
                </TreeView>
            ) : (
                <Spinner color='primary' size='3rem' />
            )}
        </>

    )
})
export default PermissionPicker;
