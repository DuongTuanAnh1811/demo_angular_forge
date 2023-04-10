import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { ForgeViewerService } from '../services/forge-viewer.service';
declare const Autodesk: any;

@Component({
  selector: 'forge-viewer',
  templateUrl: './forge-viewer.component.html',
  styleUrls: ['./forge-viewer.component.scss'],
})
export class ForgeViewerComponent implements OnInit, OnDestroy {
  @ViewChild('viewerContainer', { read: ElementRef })
  viewerContainer: ElementRef<HTMLDivElement>;
  public viewer: any;
  private urn =
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZnNuNXp2MmxkYWs2eTJodXl6Z2cwZ2tteXozbmZmYWotZGVtby9WYWxpZGF0aW9uRG9vci5ydnQ';
  constructor(
    private elementRef: ElementRef,
    private forgeViewerService: ForgeViewerService
  ) {}
  ngOnInit() {
    this.forgeViewerService.getApiAccessToken().subscribe();
  }

  ngAfterViewInit() {
    this.loadModelNew(this.viewer, this.viewerContainer);
  }

  public loadModelNew(viewer: any, viewerContainer: any) {
    const option = {
      env: 'AutodeskProduction',
      api: 'derivativeV2',
      getAccessToken: (onSuccess: any) =>
        this.forgeViewerService.getForgeToken(onSuccess),
      language: 'en',
    };
    Autodesk.Viewing.Initializer(option, () => {
      viewer?.finish();
      viewer = new Autodesk.Viewing.Private.GuiViewer3D(
        viewerContainer.nativeElement
      );

      let startedCode = viewer.start();
      if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
      }
      console.log('Initialization complete, loading a model next...');
      let documentId = `urn:${this.urn}`;
      Autodesk.Viewing.Document.load(
        documentId,
        (document: any) => {
          let view3ds = document
            .getRoot()
            .search({ type: 'geometry', role: '3d' });

          viewer.loadDocumentNode(document, view3ds[0]).then((data: any) => {});
        },
        (error: any) => {
          console.error(error);
        }
      );
    });
  }

  ngOnDestroy() {}
}
