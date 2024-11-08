var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import JSZip from 'jszip';
import { ROCrate } from 'ro-crate';
const RoCrateSingleton = (() => {
    let trackProperties = null;
    let trackPropertiesURL = null;
    let trackCrate = null;
    let trackCrateZip = null;
    let previewHtml = null;
    let currentCrateUrl = null;
    let specifiedCrateFolder = null;
    // const determineFilePath = (fileName) => {
    //   console.log('files', trackCrateZip.files);
    //   return specifiedCrateFolder &&
    //     trackCrateZip.files[`${specifiedCrateFolder}/ro-crate-preview.html`]
    //     ? `${specifiedCrateFolder}/${fileName}`
    //     : fileName;
    // };
    const determineFilePath = (fileName) => {
        return specifiedCrateFolder
            ? `${specifiedCrateFolder}/${fileName}`
            : fileName;
    };
    const extractDetailsFromCrateZip = (crateUrl) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('CRATE URL ', crateUrl);
        currentCrateUrl = crateUrl;
        try {
            const response = yield fetch(crateUrl);
            if (response.status === 200 || response.status === 0) {
                const blob = yield response.blob();
                const crateZip = yield JSZip.loadAsync(blob);
                trackCrateZip = crateZip;
                const metadataJson = yield crateZip
                    .file(determineFilePath('ro-crate-metadata.json'))
                    .async('string');
                const metadata = JSON.parse(metadataJson);
                trackCrate = new ROCrate(metadata, {
                    link: true,
                    array: true,
                });
            }
            else {
                throw new Error(response.statusText);
            }
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching RO crate:', error);
        }
    });
    const getTrackProperties = (crateUrl) => __awaiter(void 0, void 0, void 0, function* () {
        if (!trackProperties || currentCrateUrl !== crateUrl || !trackCrate) {
            yield extractDetailsFromCrateZip(crateUrl);
            const tree = trackCrate.getNormalizedTree();
            let filePointer;
            tree.hasPart.forEach((dataset) => {
                if (dataset['@type'].includes('File') &&
                    dataset.encodingFormat[0]['@value'].includes('gff')) {
                    filePointer = dataset['@id'];
                }
            });
            const name = tree.name[0]['@value'].split(' ')[0];
            const gff = yield trackCrateZip
                .file(determineFilePath(filePointer))
                .async('base64');
            const trackAttributes = {
                name,
                type: 'annotation',
                format: 'gff3',
                displayMode: 'EXPANDED',
                initialCrateUrl: crateUrl,
                url: `data:application/octet-stream;base64,${gff}`,
                label: name,
                crate: {
                    tree,
                    zip: trackCrateZip,
                },
            };
            trackProperties = trackAttributes;
            trackPropertiesURL = trackAttributes.url;
        }
        return trackProperties;
    });
    const getTrackPropertiesURL = (crateUrl) => __awaiter(void 0, void 0, void 0, function* () {
        if (!trackPropertiesURL) {
            yield extractDetailsFromCrateZip(crateUrl);
            yield getTrackProperties(crateUrl);
        }
        return trackPropertiesURL;
    });
    const getTrackCrate = (crateUrl) => __awaiter(void 0, void 0, void 0, function* () {
        if (!trackCrate) {
            yield extractDetailsFromCrateZip(crateUrl);
        }
        return trackCrate;
    });
    const getPreviewHtml = (crateUrl_1, ...args_1) => __awaiter(void 0, [crateUrl_1, ...args_1], void 0, function* (crateUrl, specificCrateFolder = null) {
        specifiedCrateFolder = specificCrateFolder;
        if (!previewHtml || currentCrateUrl !== crateUrl) {
            yield extractDetailsFromCrateZip(crateUrl);
        }
        previewHtml = trackCrateZip
            .file(determineFilePath('ro-crate-preview.html'))
            .async('string');
        return previewHtml;
    });
    const getHtmlContent = (fileName_1, crateUrl_1, ...args_1) => __awaiter(void 0, [fileName_1, crateUrl_1, ...args_1], void 0, function* (fileName, crateUrl, specificCrateFolder = null) {
        specifiedCrateFolder = specificCrateFolder;
        if (!previewHtml || currentCrateUrl !== crateUrl) {
            yield extractDetailsFromCrateZip(crateUrl);
        }
        return trackCrateZip.file(determineFilePath(fileName)).async('string');
    });
    return {
        getTrackProperties,
        getTrackPropertiesURL,
        getTrackCrate,
        getPreviewHtml,
        getHtmlContent,
    };
})();
export default RoCrateSingleton;
