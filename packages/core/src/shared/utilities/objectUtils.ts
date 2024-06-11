/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
export const _Set = <T extends object, TState extends object>(
    obj: TState,
    path: string | string[],
    value: any
): TState => {
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

    if (pathArray !== null) {
        pathArray.reduce((acc, key, i) => {
            if (acc[key] === undefined) {
                acc[key] = {}
            }
            if (i === pathArray.length - 1) {
                acc[key] = value
            }
            return acc[key]
        }, obj as Record<string, any>) // Add index signature to acc
    }

    return obj
}

export const _Get = <T extends object, TState extends object, TDefault = undefined>(
    obj: TState,
    path: string | string[],
    defaultValue?: TDefault
): TDefault | any => {
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

    if (pathArray !== null) {
        return pathArray.reduce((acc, key) => acc && acc[key], obj as Record<string, any>) || defaultValue
    }
    return defaultValue
}

export const _IsEmpty = <T extends object>(obj: T): boolean => {
    if (obj === undefined) {
        return true
    } // handle null and undefined
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.length === 0
        } else if (obj instanceof Map || obj instanceof Set) {
            return obj.size === 0
        } else {
            return Object.entries(obj).length === 0
        }
    }
    return false
}

export const _CloneDeep = <T extends object>(obj: T): T => {
    if (typeof obj !== 'object' || obj === null) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map(_CloneDeep) as T
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as any
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags) as any
    }

    const clone: any = {}

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = _CloneDeep(obj[key] as object)
        }
    }

    const proto = Object.getPrototypeOf(obj)
    return Object.setPrototypeOf(clone, proto) as T
}
