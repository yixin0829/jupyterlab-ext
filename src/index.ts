import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';
import { CounterWidget } from './ReactCounter';
import { reactIcon } from '@jupyterlab/ui-components';
import { FlowWidget } from './ReactFlow';

/**
 * The command IDs used by the react-widget plugin.
 */
namespace CommandIDs {
  export const apod = 'apod:open';
  export const react_counter = 'create-react-counter-widget';
  export const react_flow = 'create-react-flow-widget'
}

// define the type that was introduced in the newWidget() function
interface APODResponse {
  copyright: string;
  date: string;
  explanation: string;
  media_type: 'video' | 'image';
  title: string;
  url: string;
};

class APODWidget extends Widget {
  /**
  * Construct a new APOD widget.
  */
  constructor() {
    super(); // in order to run the constructor of the base class Widget (TS-specific)

    this.addClass('my-apodWidget'); // add css stylings

    // Add an image element to the panel
    this.img = document.createElement('img');
    this.node.appendChild(this.img);

    // Add a summary element to the panel
    this.summary = document.createElement('p');
    this.node.appendChild(this.summary);
  }

  /**
  * The image element associated with the widget.
  */
  readonly img: HTMLImageElement;

  /**
  * The summary text element associated with the widget.
  */
  readonly summary: HTMLParagraphElement;

  /**
  * Handle update requests for the widget.
  */
  async updateAPODImage(): Promise<void> {

    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${this.randomDate()}`);

    if (!response.ok) {
      const data = await response.json();
      if (data.error) {
        this.summary.innerText = data.error.message;
      } else {
        this.summary.innerText = response.statusText;
      }
      return;
    }

    const data = await response.json() as APODResponse;

    if (data.media_type === 'image') {
      // Populate the image
      this.img.src = data.url;
      this.img.title = data.title;
      this.summary.innerText = data.title;
      if (data.copyright) {
        this.summary.innerText += ` (Copyright ${data.copyright})`;
      }
    } else {
      this.summary.innerText = 'Random APOD fetched was not an image.';
    }
  }

  /**
  * Get a random date string in YYYY-MM-DD format.
  */
  randomDate(): string {
    const start = new Date(2010, 1, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
    return randomDate.toISOString().slice(0, 10);
  }
}

/**
* Activate the APOD widget extension.
*/
function activate(app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer | null) {
  console.log('JupyterLab extension jupyterlab_apod is activated!');

  /**
   * 1) tutorial
   */
  // Declare a widget variable
  let widget: MainAreaWidget<APODWidget>;

  // Add an application command
  let command_1:string = CommandIDs.apod
  app.commands.addCommand(command_1, {
    label: 'Random Astronomy Picture',
    execute: () => {
      if (!widget || widget.isDisposed) {
        const content = new APODWidget();
        widget = new MainAreaWidget({content});
        widget.id = 'apod-jupyterlab';
        widget.title.label = 'Astronomy Picture';
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
      widget.content.updateAPODImage();

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  //* Note: if command string is the same as the key "command" then you can just write {command , category: ...}
  palette.addItem({ command: command_1, category: 'Tutorial' }); 

  // Track and restore the widget state
  let tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({
    namespace: 'apod'
  });

  // Since the plugin token is declared as optional so restorer can be ILayoutRestorer | null
  if (restorer) {
    restorer.restore(tracker, {
      command: command_1, //* Note: if command string is the same as the key "command" then you can just write command (value only)
      name: () => 'apod'
    });
  }

  /**
   * 2) react counter widget command
   */
  let command_2:string = CommandIDs.react_counter
  app.commands.addCommand(command_2, {
    caption: 'Create a new React Widget',
    label: 'React Counter Widget',
    execute: () => {
      const content = new CounterWidget();
      const widget = new MainAreaWidget<CounterWidget>({ content });
      widget.title.label = 'React Widget';
      widget.title.icon = reactIcon;

      if (!tracker_counter.has(widget)) {
        // Track the state of the widget for later restoration
        tracker_counter.add(widget);
      }

      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
    },
  });

  // Add the command to the palette
  palette.addItem({ command: command_2, category: 'Tutorial' });

  // Track and restore the widget state
  let tracker_counter = new WidgetTracker<MainAreaWidget<CounterWidget>>({
    namespace: 'react_counter'
  });

  // Since the plugin token is declared as optional so restorer can be ILayoutRestorer | null
  if (restorer) {
    restorer.restore(tracker_counter, {
      command: command_2,
      name: () => 'react_counter'
    });
  }

  /**
   * 3) react flowchart widget command
   */
  let command_3:string = CommandIDs.react_flow
  app.commands.addCommand(command_3, {
    caption: 'Create a new React Flowchart widget',
    label: 'React Flow Widget',
    execute: () => {
      const content = new FlowWidget();
      const widget = new MainAreaWidget<FlowWidget>({ content });
      widget.title.label = 'React Flowchart';
      widget.title.icon = reactIcon;

      if (!tracker_flow.has(widget)) {
        // Track the state of the widget for later restoration
        tracker_flow.add(widget);
      }

      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
    },
  });

  // Add the command to the palette
  palette.addItem({ command: command_3, category: 'Tutorial' });

  // Track and restore the widget state
  let tracker_flow = new WidgetTracker<MainAreaWidget<FlowWidget>>({
    namespace: 'react_flow'
  });

  // Since the plugin token is declared as optional so restorer can be ILayoutRestorer | null
  if (restorer) {
    restorer.restore(tracker_flow, {
      command: command_3,
      name: () => 'react_flow'
    });
  }

}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_apod',
  autoStart: true,
  requires: [ICommandPalette], // lists of tokens corresponding to services other plugins provide.
  optional: [ILayoutRestorer], // lists of tokens corresponding to services other plugins provide.
  activate: activate
};

export default plugin;