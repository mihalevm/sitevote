import uvicorn
from rest.lib.config import Configuration

config: Configuration = Configuration('server.ini')
rest_config = config.get_section('REST')

if __name__ == "__main__":
    uvicorn.run(
        'rest.controller.router:router',
        host=rest_config['host'],
        port=int(rest_config['port']),
        log_level=rest_config['log_level'],
        workers=int(rest_config['workers']),
        root_path=rest_config['root_path']
    )
